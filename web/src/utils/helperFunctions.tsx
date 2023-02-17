import { BigNumber, ethers } from "ethers";
import { useContract } from "../context/ContractContext";

const properEthFormat = (balance: BigNumber): string => ethers.utils.formatEther(balance);

// let testContractBalance: string;

export const useGetContractBalance = async (): Promise<string> => {

    const contract = useContract();

    const contractTotal: BigNumber = await contract?.getTotalContractAmount();
    const properFormattedBalance = properEthFormat(contractTotal);
    console.log(properEthFormat(contractTotal));
    return properFormattedBalance;
};