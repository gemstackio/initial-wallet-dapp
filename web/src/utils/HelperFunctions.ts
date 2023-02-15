import { BigNumber, Contract, ethers } from "ethers";
import React from "react";

const properEthFormat = (balance: BigNumber): string => ethers.utils.formatEther(balance);

const getContractBalance = async (contract: Contract, setContractBalance: React.Dispatch<React.SetStateAction<string>>): Promise<string> => {
    const contractTotal: BigNumber = await contract?.getTotalContractAmount();
    const properFormattedBalance = properEthFormat(contractTotal);
    console.log(properEthFormat(contractTotal));
    setContractBalance(properFormattedBalance);
    return properFormattedBalance;
};

const depositToContract = async (amount: string, signer: ethers.Signer, contract: Contract): Promise<void> => {
    console.log(signer);

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


const transferAllFromContract = async (signer: ethers.Signer, provider: ethers.providers.Web3Provider, contract: ethers.Contract): Promise<void> => {
    console.log(signer);
    console.log(provider);

    if (typeof signer === 'object' && provider !== undefined) {
        console.log("Fired");
        // must put a try catch to catch errors
        try {
            let transaction = await contract?.connect(signer).transferAll();
            transaction.wait().then(() => console.log(`Transaction complete! Hash: ${transaction.hash}`));
        } catch (error: any) {
            console.error();
        }
    }
}

export { getContractBalance, depositToContract, transferAllFromContract, properEthFormat };