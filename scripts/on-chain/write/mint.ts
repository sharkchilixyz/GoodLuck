import { setupCommonEnv } from "../setup/setup-env";

async function main() {

    const { deployer, player, MockUSDT, GoodLuck} = await setupCommonEnv();

    console.log("start-----------------------")
    await player.MockUSDT.mint(player.address, BigInt("100000000000000000000")).then((tx: { wait: () => void; }) => { 
        tx.wait();
        console.log("palyer mint MockUSDT:",tx);
    });
    await deployer.MockUSDT.mint(deployer.address, BigInt("100000000000000000000")).then((tx: { wait: () => void; }) => { 
        tx.wait();
        console.log("deployer mint MockUSDT:",tx);
    });
    await player.MockUSDT.approve(GoodLuck.address, BigInt("100000000000000000000")).then((tx: { wait: () => void; }) => {
        tx.wait();
        console.log("palyer approve MockUSDT:",tx);
    });
    await deployer.MockUSDT.approve(GoodLuck.address, BigInt("100000000000000000000")).then((tx: { wait: () => void; }) => {
        tx.wait();
        console.log("deployer approve MockUSDT:",tx);
    });
}

main();