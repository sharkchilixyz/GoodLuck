import { setupCommonEnv } from "../setup/setup-env";
import { ethers } from "hardhat";

async function main() {

    const { deployer, MockUSDT, GoodLuck} = await setupCommonEnv();

    const hash = ethers.utils.solidityKeccak256(["uint8", "string"], [2, "good"]);
    await deployer.GoodLuck.createGamecreateGame(BigInt("10000000000000000000"), hash).then((tx: { wait: () => void; }) => { 
        tx.wait();
        console.log("banker create game:",tx);
    });
}
main();