import { BigNumber, Contract, utils } from "ethers";

const properEthFormat = (balance: BigNumber): string => utils.formatEther(balance);

const getContractBalance = async (contract: Contract, setContractBalance: Function): Promise<string> => {
    const contractTotal: BigNumber = await contract?.getTotalContractAmount();
    const properFormattedBalance = properEthFormat(contractTotal);
    console.log(properEthFormat(contractTotal));
    setContractBalance(properFormattedBalance);
    return properFormattedBalance;
};


export { getContractBalance };