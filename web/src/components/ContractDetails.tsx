import React from 'react';
import { useContract } from '../context/ContractContext';
import { useMetaMaskAccount } from '../context/MetaMaskAccountContext';

const ContractDetails = () => {
    const contract = useContract();
    const currentMetaMaskAccount = useMetaMaskAccount();

    const contractAddress = contract?.address

    return (
        <div>
            <h1>Contract Details</h1>
            <ul>
                {(!contract) ? <li>Loading Contract Details</li> : <li><strong>Contract Address:</strong> {contractAddress}</li>}
                {(!currentMetaMaskAccount) ? <li>No Current Account Address</li> : <li><strong>Current Account Address:</strong> {currentMetaMaskAccount}</li>}
            </ul>
        </div>
    );
};

export default ContractDetails;