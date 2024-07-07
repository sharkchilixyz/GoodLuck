import { setupCommonEnv } from "../setup/setup-env";
import { ethers } from "hardhat";

async function main() {

    const { deployer, player, MockUSDT, GoodLuck} = await setupCommonEnv();

    await player.GoodLuck.settle(3).then((tx: { wait: () => void; }) => { 
        tx.wait();
        console.log("banker settle game:",tx);
    });
}
main();