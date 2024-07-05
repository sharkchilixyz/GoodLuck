import { setupCommonEnv } from "../setup/setup-env";
import { ethers } from "hardhat";

async function main() {

    const { deployer, MockUSDT, GoodLuck} = await setupCommonEnv();

    await deployer.GoodLuck.settle(0).then((tx: { wait: () => void; }) => { 
        tx.wait();
        console.log("banker settle game:",tx);
    });
}
main();