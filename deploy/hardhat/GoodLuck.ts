import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const MockUSDT = await deployments.get("MockUSDT");

    await deploy("GoodLuck", {
        from: deployer,
        args: [MockUSDT.address, 120],
        log: true,
    });
}

export default func;
func.tags = ["GoodLuck"];
func.dependencies = ["MockUSDT"];