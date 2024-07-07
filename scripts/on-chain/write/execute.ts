import { setupCommonEnv } from "../setup/setup-env";
import { ethers } from "hardhat";

async function main() {

    const { deployer, MockUSDT, GoodLuck} = await setupCommonEnv();

    await deployer.GoodLuck.execute(3, 2, "good").then((tx: { wait: () => void; }) => { 
        tx.wait();
        console.log("banker execute game:",tx);
    });
}
main();