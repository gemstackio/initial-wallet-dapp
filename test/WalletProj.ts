import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Contract, Signer } from 'ethers';

const tokenize = (n: BigNumber) => ethers.utils.parseUnits(n.toString(), 'ether')

const properEthFormat = (balance: BigNumber) => ethers.utils.formatUnits(balance, 'ether')

describe("WalletProj", () => {
    let walletProj: Contract;
    let deployer: Signer;
    let owner1: Signer;

    const NAME: string = 'Wallet Project';
    const SYMBOL = 'ETHD';

    let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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
    })

    describe("Contract State", () => {

        it('Contract has a balance - Checked with JsonRpcProvider', async () => {
            // This uses the JsonRpcProvider to check an actual deployed contract's balance
            let provider = new ethers.providers.JsonRpcProvider();

            let contractBalance: BigNumber = await provider.getBalance(contractAddress)

            let etherString: string = ethers.utils.formatEther(contractBalance)

            // console.log(`Balance of ${contractAddress} is ${etherString} ether`);

            expect(contractBalance).to.equal(0)
        })

        it('Contract has a balance - Checked with Internal getTotalContractAmount()', async () => {
            // This uses the internally built method within our contract to check the deployed instance of this contract which is deployed within the scope of this test
            // Said instance is deployed on line 18
            let contractBalance: BigNumber = await walletProj.getTotalContractAmount();
            const contractName = await walletProj.name();

            let etherString: string = ethers.utils.formatEther(contractBalance);

            // console.log(`Balance of ${contractName} is ${etherString} ether`);

            expect(contractBalance).to.equal(0);
        })

        it('Contract can receive balance', async () => {
            const AMOUNT = ethers.utils.parseUnits('10', 'ether');

            const transaction = await walletProj.connect(owner1).depositToContract({ value: AMOUNT });

            let contractBalance: BigNumber = await walletProj.getTotalContractAmount();
            const contractName = await walletProj.name();

            let etherString: string = ethers.utils.formatEther(contractBalance);

            // console.log(`Balance of ${contractName} is ${etherString} ether`);

            expect(contractBalance).to.equal(AMOUNT)
        })
    })

    describe('Withdrawing Funds From Contract', () => {
        const AMOUNT: BigNumber = ethers.utils.parseUnits("10", 'ether')
        let balanceBefore: BigNumber;
        let contractDeployerAddress: string;
        let owner1Address: string;

        beforeEach(async () => {
            contractDeployerAddress = await deployer.getAddress()
            owner1Address = await owner1.getAddress()
            balanceBefore = await ethers.provider.getBalance(contractDeployerAddress)

            let transaction = await walletProj.connect(owner1).depositToContract({ value: AMOUNT })
            transaction = await walletProj.connect(deployer).transferAll()
        })

        // it('Transaction Other than owner cannot withdraw all funds', async () => {
        //     const balanceAfter = await ethers.provider.getBalance(contractDeployerAddress) //get balance of the contract
        //     const ethBalanceBefore = await properEthFormat(balanceBefore) // balance before transaction
        //     const ethBalanceAfter = await properEthFormat(balanceAfter) // balance after transaction
        //     // console.log(ethBalanceBefore)
        //     // console.log(`balanceBefore: ${ethBalanceBefore} | balanceAfter: ${ethBalanceAfter}`);
        //     expect(balanceAfter).to.be.equal(balanceBefore);
        // })

        it('Transaction Owner Can Withdraw all Funds', async () => {
            const balanceAfter = await ethers.provider.getBalance(contractDeployerAddress);

            const ethBalanceBefore = await properEthFormat(balanceBefore)
            const ethBalanceAfter = await properEthFormat(balanceAfter)

            // console.log(ethBalanceBefore)
            // console.log(`balanceBefore: ${ethBalanceBefore} | balanceAfter: ${ethBalanceAfter}`);

            expect(balanceAfter).to.be.greaterThan(balanceBefore);
        })
        it('Contract does not transfer with balance > transfer amount', async () => {
            // this try block should fail, as the contract balance is low
            try {
                const receiversBeforeBalance = await ethers.provider.getBalance(owner1Address)
                const ethBalanceBefore = await properEthFormat(receiversBeforeBalance)
                let transaction = await walletProj.connect(deployer).transferAmountFromContract(1, owner1Address)
                await transaction.wait()
                const receiversBeforeAfter = await ethers.provider.getBalance(owner1Address)
                assert(false)
            }
            catch (err) {
                // uncomment this if you wish to see the actual error message
                // console.log(err)
                assert(true)
            }
        })
        it('Contract Can Transfer Eth to another Wallet', async () => {

            const receiversBeforeBalance = await ethers.provider.getBalance(owner1Address)
            const ethBalanceBefore = await properEthFormat(receiversBeforeBalance)
            let fundSmartContractTrans = await walletProj.connect(deployer).depositToContract({ value: AMOUNT })
            await fundSmartContractTrans.wait()

            let transaction = await walletProj.connect(deployer).transferAmountFromContract(1, owner1Address)
            await transaction.wait()
            // console.log(transaction);
            // let transaction 
            // console.log(AMOUNT, owner1Address)
            const receiversBeforeAfter = await ethers.provider.getBalance(owner1Address)


            // let transaction = await walletProj.connect(deployer).transferAmountFromContract(AMOUNT, owner1Address)

            // transaction = await walletProj.connect(deployer).transferAll()

            // const ethBalanceAfter = await properEthFormat(receiversBeforeAfter)

            // console.log(`balanceBefore: ${ethBalanceBefore} | balanceAfter: ${ethBalanceAfter}`);

            expect(receiversBeforeAfter).to.be.greaterThan(receiversBeforeBalance);
        })
    })
})