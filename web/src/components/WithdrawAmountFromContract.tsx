import { ethers } from 'ethers';
import React, { useRef } from 'react';
import { useContract } from '../context/ContractContext';
import { useSigner } from '../context/SignerContext';
import { useWeb3ProviderContext } from '../context/Web3ProviderContext';

const WithdrawAmountFromContract = () => {
    const defaultRecipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    const signer = useSigner();
    const provider = useWeb3ProviderContext();
    const contract = useContract();

    const transactionAmountRef = useRef<HTMLInputElement>(null);
    const transactionRecipientRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let amount = transactionAmountRef.current?.value
        let recipientAddress: string | undefined;

        if (transactionRecipientRef.current?.value === "")
            recipientAddress = defaultRecipient;
        else
            recipientAddress = transactionRecipientRef.current?.value

        console.log(recipientAddress);

        const args = { signer, provider, contract, amount, recipientAddress }
        withdrawAmountFromContract(args);
    }

    return (
        <div>
            <h1>Withdraw ETH from Contract</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="amount">Amount: </label>
                <input
                    ref={transactionAmountRef}
                    type="number"
                    id="amount"
                />
                <label htmlFor="amount">Recipient: </label>
                <input
                    ref={transactionRecipientRef}
                    type="text"
                    id="recipient"
                />
                <br />
                <button type="submit">
                    Submit Transaction
                </button>
            </form>

        </div>
    );
};

export default WithdrawAmountFromContract;


interface CustomParams {
    signer: ethers.Signer | undefined;
    provider: ethers.providers.Web3Provider | undefined;
    contract: ethers.Contract | undefined;
    amount: string | undefined;
    recipientAddress: string | undefined;
}

const withdrawAmountFromContract = async ({ signer, provider, contract, amount, recipientAddress }: CustomParams): Promise<void> => {
    if (typeof signer === 'object' && provider !== undefined && amount !== undefined) {
        try {
            const transferAmount = ethers.utils.parseUnits(amount, 'ether');

            let transaction = await contract?.connect(signer).transferAmountFromContract(transferAmount, recipientAddress);
            transaction.wait().then(() => console.log(`Transaction complete! Hash: ${transaction.hash}`));
        } catch (error: any) {
            console.dir(error)
        }
    }
}