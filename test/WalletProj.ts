import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from 'ethers';

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

            console.log(deployer.address)
            expect(contractOwner).to.equal(deployer.address);
        })
    })
})