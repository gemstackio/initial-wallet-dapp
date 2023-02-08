import { useRef } from "react";

interface SendFundsProps {
    callBack: Function;
}

const SendFunds = ({ callBack }: SendFundsProps) => {
    // Using a useRef here instead of useState because there is no need for a state variable sense we do not care about the value other than providing it to our callBack
    // We only need state for values we need to constantly track
    // Also stops us from causing multiple re-renders
    const transactionAmountRef = useRef<HTMLInputElement>(null);

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        callBack(transactionAmountRef.current?.value);
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

export default SendFunds;