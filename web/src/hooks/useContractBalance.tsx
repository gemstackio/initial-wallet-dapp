import { useEffect, useState } from 'react';
import { useContract } from '../context/ContractContext';
import { BigNumber, ethers } from 'ethers';

const useContractBalance = (): [string, () => Promise<void>] => {
    const contract = useContract();
    const [contractBalance, setContractBalance] = useState<string>('');

    const getContractBalance = async (): Promise<void> => {
        if (contract) {
            const contractTotal: BigNumber = await contract.getTotalContractAmount();
            const properFormattedBalance = ethers.utils.formatEther(contractTotal);
            setContractBalance(properFormattedBalance);
        }
    };

    useEffect(() => {
        getContractBalance();
    }, [contract]);

    return [contractBalance, getContractBalance];
};

export default useContractBalance;
