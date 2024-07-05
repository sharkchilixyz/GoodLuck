import { setupCommonEnv } from "../setup/setup-env";
import { ethers } from "hardhat";

async function main() {

    const { player, MockUSDT, GoodLuck} = await setupCommonEnv();

    await player.GoodLuck.createGamecreateGamejoinGame(0, 1).then((tx: { wait: () => void; }) => { 
        tx.wait();
        console.log("player join game:",tx);
    });
}
main();