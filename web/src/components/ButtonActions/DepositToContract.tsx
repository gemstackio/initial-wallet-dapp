import { Contract, ethers } from "ethers";
import { useRef } from "react";

interface DepositToContractProps {
    contract: Contract | undefined;
    signer: ethers.Signer | undefined;
}

const DepositToContract = ({ contract, signer }: DepositToContractProps) => {


    // Using a useRef here instead of useState because there is no need for a state variable sense we do not care about the value other than providing it to our callBack
    // We only need state for values we need to constantly track
    // Also stops us from causing multiple re-renders
    const transactionAmountRef = useRef<HTMLInputElement>(null);

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        let amount = transactionAmountRef.current?.value

        if (typeof amount === "string" && typeof signer === 'object' && typeof contract === 'object')
            depositToContract(amount, signer, contract);
    }

    return (
        <form onSubmit={submitForm}>
            <label htmlFor="amount"></label>
            <input
                ref={transactionAmountRef}
                type="number"
                id="amount"
            />
            <button type="submit">
                Submit Transaction
            </button>
        </form>
    );
};


async function depositToContract(amount: string, signer: ethers.Signer, contract: Contract): Promise<void> {

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