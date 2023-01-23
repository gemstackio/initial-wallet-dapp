import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from 'ethers';

describe("WalletProj", () => {
    let walletProj: Contract;
    let deployer: Signer;
    let owner1: Signer;

    const NAME: string = 'Wallet Project';
    const SYMBOL = 'ETHD'

    beforeEach(async () => {
        [deployer, owner1] = await ethers.getSigners();

        const WalletProj = await ethers.getContractFactory(`WalletProj`);

        walletProj = await WalletProj.deploy("Wallet Project", "ETHD");
    })

    describe("Deployment", () => {
        it("Contract has a name", async () => {
            const contractName = await walletProj.name();
            expect(contractName).to.equal(NAME);
        })

        it('Has a symbol', async () => {
            const contractSymbol = await walletProj.symbol();

            expect(contractSymbol).to.equal(SYMBOL);
        });

        it("Should set the owner", async () => {
            const contractOwner = await walletProj.owner();
            const contractDeployerAddress = await deployer.getAddress()

            expect(contractOwner).to.equal(contractDeployerAddress);
        })
    })

    describe("Contract State", () => {

        it('Contract has a balance - Checked with JsonRpcProvider Provider', async () => {
            let provider = new ethers.providers.JsonRpcProvider();

            let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

            let contractBalance: BigNumber = await provider.getBalance(contractAddress)

            let etherString: string = ethers.utils.formatEther(contractBalance)

            console.log(`Balance of ${contractAddress} is ${etherString} ether`);

            expect(contractBalance).to.equal(0)
        })

        it('Contract has a balance - Checked with Internal getTotalContractAmount()', async () => {
            let contractBalance: BigNumber = await walletProj.getTotalContractAmount()
            const contractName = await walletProj.name();


            let etherString: string = ethers.utils.formatEther(contractBalance)

            console.log(`Balance of ${contractName} is ${etherString} ether`);

            expect(contractBalance).to.equal(0)
        })

    })
})