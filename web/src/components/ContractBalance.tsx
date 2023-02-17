import { useEffect } from 'react';
import useContractBalance from '../hooks/useContractBalance';

const ContractBalance = () => {
    const [contractBalance, getContractBalance] = useContractBalance();

    return (
        <>
            {(!contractBalance) ? <h2>Loading Contract Balance</h2> : <h2>Current Contract Balance: {contractBalance} eth</h2>}
            <button onClick={getContractBalance}>Refresh Balance</button>
        </>
    );
};

export default ContractBalance;
