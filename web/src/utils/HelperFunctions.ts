import { BigNumber, Contract, ethers } from "ethers";

const properEthFormat = (balance: BigNumber): string => ethers.utils.formatEther(balance);

const getContractBalance = async (contract: Contract, setContractBalance: Function): Promise<string> => {
    const contractTotal: BigNumber = await contract?.getTotalContractAmount();
    const properFormattedBalance = properEthFormat(contractTotal);
    console.log(properEthFormat(contractTotal));
    setContractBalance(properFormattedBalance);
    return properFormattedBalance;
};

const depositToContract = async (amount: string, signer: ethers.Signer, contract: Contract): Promise<void> => {
    const AMOUNT = ethers.utils.parseUnits(amount, 'ether');

    if (typeof signer === 'object' && signer !== undefined) {
        // Connecting the contract with the signer
        const connectedContract = await contract?.connect(signer);
        try {
            // using our smart contract method to send 
            const transaction = await connectedContract?.depositToContract({ value: AMOUNT });
            console.log(transaction);
            transaction.wait().then(() => {
                console.log(`Transaction complete! Hash: ${transaction.hash}`)
            });
        } catch (error) {
            console.log(error);
        }
    }
};


export { getContractBalance, depositToContract };