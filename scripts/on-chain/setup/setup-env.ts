import { deployments, ethers, getNamedAccounts, getUnnamedAccounts } from "hardhat";
import { MockUSDT, GoodLuck } from "../../../src/types";
import { setupUser, setupUsers } from "../../../test/utils/user-setup";
// import { LocalTestChainIdConfig } from "../../config/LocalTestChainIdConfig";

export async function setup() {

    const GoodLuckContract = await deployments.get("GoodLuck");
    const MockUSDTContract = await deployments.get("MockUSDT");
    
    const contracts = {
        GoodLuck: (await ethers.getContractAt(GoodLuckContract.abi, GoodLuckContract.address)),
        MockUSDT: (await ethers.getContractAt(MockUSDTContract.abi, MockUSDTContract.address)),
    };

    const { deployer, player } = await getNamedAccounts();

    const signers = {
        deployer: await setupUser(deployer, contracts),
        player: await setupUser(player, contracts)
    }

    return {
        contracts,
        signers
    }
}

export async function setupCommonEnv() {
    const { contracts, signers } = await setup();

    return {
        ...contracts,
        ...signers
    }
}
