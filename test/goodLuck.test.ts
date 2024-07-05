import { expect } from "chai";
import { BigNumber, utils } from "ethers" ;
import { base58 } from "ethers/lib/utils";
import { ethers , hardhatArguments, network} from "hardhat";
import { setupDepEnv } from "./setup/goodLuck-env";
import { IGoodLuck, GoodLuck } from "../src/types";

describe("GoodLuck contract", function() {
    describe("Game", function() {
        it("banker create game, user join game and banker win", async function() {
            const { MockUSDT, GoodLuck, users  } = await setupDepEnv();
            const hash = ethers.utils.solidityKeccak256(["uint8", "string"], [2, "good"]);
            await users[0].GoodLuck.createGame(BigInt("10000000000000000000"), hash);
            await users[1].GoodLuck.joinGame(0, 1);
            await users[0].GoodLuck.execute(0, 2, "good");

            const user0Balance = await MockUSDT.balanceOf(users[0].address);
            const user1Balance = await MockUSDT.balanceOf(users[1].address);
            const res = await MockUSDT.balanceOf(GoodLuck.address)
            const gameData = await GoodLuck.getGameData(0)
            expect(res).to.equal(BigInt("0"));
            expect(gameData._bankerHash).to.equal(hash);
            expect(gameData._player).to.equal(users[1].address);
            expect(user0Balance).to.equal(BigInt("110000000000000000000"));
            expect(user1Balance).to.equal(BigInt("90000000000000000000"));
        })

        it("banker create game, user join game and banker lose", async function() {
            const { MockUSDT, GoodLuck, users  } = await setupDepEnv();
            const hash = ethers.utils.solidityKeccak256(["uint8", "string"], [2, "good"]);
            await users[0].GoodLuck.createGame(BigInt("10000000000000000000"), hash);
            await users[1].GoodLuck.joinGame(0, 3);
            await users[0].GoodLuck.execute(0, 2, "good");

            const user0Balance = await MockUSDT.balanceOf(users[0].address);
            const user1Balance = await MockUSDT.balanceOf(users[1].address);
            const res = await MockUSDT.balanceOf(GoodLuck.address)
            const gameData = await GoodLuck.getGameData(0)
            expect(res).to.equal(BigInt("0"));
            expect(gameData._bankerHash).to.equal(hash);
            expect(gameData._player).to.equal(users[1].address);
            expect(user0Balance).to.equal(BigInt("90000000000000000000"));
            expect(user1Balance).to.equal(BigInt("110000000000000000000"));
        })

        it("banker create game, user join game and tie, refund both", async function() {
            const { MockUSDT, GoodLuck, users  } = await setupDepEnv();
            const hash = ethers.utils.solidityKeccak256(["uint8", "string"], [2, "good"]);
            await users[0].GoodLuck.createGame(BigInt("10000000000000000000"), hash);
            await users[1].GoodLuck.joinGame(0, 2);
            await users[0].GoodLuck.execute(0, 2, "good");

            const user0Balance = await MockUSDT.balanceOf(users[0].address);
            const user1Balance = await MockUSDT.balanceOf(users[1].address);
            const res = await MockUSDT.balanceOf(GoodLuck.address)
            const gameData = await GoodLuck.getGameData(0)
            expect(res).to.equal(BigInt("0"));
            expect(gameData._bankerHash).to.equal(hash);
            expect(gameData._player).to.equal(users[1].address);
            expect(user0Balance).to.equal(BigInt("100000000000000000000"));
            expect(user1Balance).to.equal(BigInt("100000000000000000000"));
        })

        it("banker create game, user join game , banker win but expired, auctual player win", async function() {
            const { MockUSDT, GoodLuck, users  } = await setupDepEnv();
            const hash = ethers.utils.solidityKeccak256(["uint8", "string"], [2, "good"]);
            await users[0].GoodLuck.createGame(BigInt("10000000000000000000"), hash);
            await users[1].GoodLuck.joinGame(0, 1);
            let timestamp = Date.parse(new Date().toString())/1000;
            await network.provider.request({
                method:"evm_setNextBlockTimestamp",
                params:[timestamp + 130],
            });
            await users[1].GoodLuck.settle(0);

            const user0Balance = await MockUSDT.balanceOf(users[0].address);
            const user1Balance = await MockUSDT.balanceOf(users[1].address);
            const res = await MockUSDT.balanceOf(GoodLuck.address)
            const gameData = await GoodLuck.getGameData(0)
            expect(res).to.equal(BigInt("0"));
            expect(gameData._bankerHash).to.equal(hash);
            expect(gameData._player).to.equal(users[1].address);
            expect(user0Balance).to.equal(BigInt("90000000000000000000"));
            expect(user1Balance).to.equal(BigInt("110000000000000000000"));
        })
    })
})