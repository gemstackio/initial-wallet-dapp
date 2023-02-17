import { ethers, providers } from "ethers";
import React, { useContext, useState, useEffect } from "react";
import { IProps } from "../interfaces/IPros";


// This is going to store the provider will need to set the type and the default value here
const Web3ProviderContext = React.createContext<providers.Web3Provider | undefined>(undefined);

// Here we are creating the actual Context container
export function useWeb3ProviderContext() {
    return useContext(Web3ProviderContext);
}

// Creating a component
export function Web3Provider({ children }: IProps) {
    const [web3Provider, setWeb3Provider] = useState<providers.Web3Provider>()

    useEffect(() => {
        const getProvider = async () => {
            const newProvider = await new ethers.providers.Web3Provider(window.ethereum);

            setWeb3Provider(newProvider);
        };

        getProvider();
    }, []);

    // console.log(web3Provider);

    return (
        <Web3ProviderContext.Provider value={web3Provider}>
            {children}
        </Web3ProviderContext.Provider>
    )
}