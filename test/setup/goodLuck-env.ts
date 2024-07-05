import { deployments, ethers, getNamedAccounts, getUnnamedAccounts } from "hardhat";
import { GoodLuck,  MockUSDT } from "../../src/types";
import { setupUser, setupUsers } from "../utils/user-setup";

export async function setup() {
    await deployments.fixture(["GoodLuck", "MockUSDT"]);
    const GoodLuckContract = await deployments.get("GoodLuck");
    const MockUSDTContract = await deployments.get("MockUSDT");
    
    const contracts = {
        GoodLuck: (await ethers.getContractAt(GoodLuckContract.abi, GoodLuckContract.address)),
        MockUSDT: (await ethers.getContractAt(MockUSDTContract.abi, MockUSDTContract.address)),
    };

    const { deployer, player } = await getNamedAccounts();
    const users = await setupUsers(await getUnnamedAccounts(), contracts);

    const signers = {
        users,
        deployer: await setupUser(deployer, contracts)
    }

    return {
        contracts,
        signers
    }
}

export async function setupDepEnv() {
    const { contracts, signers } = await setup();
    await signers.users[0].MockUSDT.mint(signers.users[0].address, BigInt("100000000000000000000"));
    await signers.users[0].MockUSDT.approve(contracts.GoodLuck.address, BigInt("100000000000000000000"));
    await signers.users[1].MockUSDT.mint(signers.users[1].address, BigInt("100000000000000000000"));
    await signers.users[1].MockUSDT.approve(contracts.GoodLuck.address, BigInt("100000000000000000000"));

    return {
        ...contracts,
        ...signers
    }
}

