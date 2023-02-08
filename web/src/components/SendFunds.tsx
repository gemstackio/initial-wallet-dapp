import { useState } from "react";

interface SendFundsProps {
    callBack: Function;
}

const SendFunds = ({ callBack }: SendFundsProps) => {

    const [transactionAmount, setTransactionAmount] = useState<string>('')


    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        callBack(transactionAmount);
    }

    return (
        <form onSubmit={submitForm}>
            <label htmlFor="amount"></label>
            <input
                onChange={(e) => setTransactionAmount(e.target.value)}
                value={transactionAmount}
                type="number"
                id="amount"
            />
            <button type="submit">
                Submit Transaction
            </button>
        </form>
    );
};

export default SendFunds;