import { ethers } from "ethers";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IConfig } from "../interfaces/IConfig";
import { IProps } from "../interfaces/IPros";
import { useWeb3ProviderContext } from "./Web3ProviderContext";
import ABI from '../abis/WalletProj.json'


const config: IConfig = require('../config.json');

const getNetworkId = async (provider: ethers.providers.Provider) => {
    const networkId = await provider.getNetwork().then((network) => network.chainId);
    return networkId;
};

const ContractContext = React.createContext<ethers.Contract | undefined>(undefined);

export const useContract = () => useContext(ContractContext);

export function ContractProvider({ children }: IProps) {
    const provider = useWeb3ProviderContext();
    const networkId = useRef<number>();
    const [contract, setContract] = useState<ethers.Contract>();


    useEffect(() => {
        const connectToRest = async (): Promise<void> => {
            // Once a change is detected it then runs the code to:
            if (typeof provider === 'object' && provider !== undefined) {
                // 1. Obtain the networkId
                const id = await getNetworkId(provider);
                networkId.current = id;

                const contractConnection = new ethers.Contract(config[id].WalletProj.address, ABI.abi, provider);
                setContract(contractConnection);
            }
        };
        connectToRest();
    }, [provider]);


    return (
        <ContractContext.Provider value={contract}>
            {children}
        </ContractContext.Provider>
    )
}