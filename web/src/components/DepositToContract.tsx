import { ethers } from 'ethers';
import React, { useRef } from 'react';
import { useContract } from '../context/ContractContext';
import { useSigner } from '../context/SignerContext';
import useContractBalance from '../hooks/useContractBalance';

const DepositToContract = () => {

    const contract = useContract();
    const signer = useSigner();
    // const [contractBalance, getContractBalance] = useContractBalance();

    const transactionAmountRef = useRef<HTMLInputElement>(null);

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        let amount = transactionAmountRef.current?.value

        if (typeof amount === "string" && typeof signer === 'object' && typeof contract === 'object')
            depositToContract(amount, signer, contract);
        // depositToContract(amount, signer, contract, getContractBalance);
    }

    return (
        <>
            <h2>Deposit ETH</h2>
            <form onSubmit={submitForm}>
                <label htmlFor="amount">Amount: </label>
                <input
                    ref={transactionAmountRef}
                    type="number"
                    id="amount"
                />
                <button type="submit">
                    Submit Transaction
                </button>
            </form>
        </>
    );
};


async function depositToContract(
    amount: string,
    signer: ethers.Signer,
    contract: ethers.Contract,
    // getContractBalance: () => Promise<void>
): Promise<void> {

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

export default DepositToContract;