import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { IProps } from "../interfaces/IPros";

const MetaMaskAccountContext = React.createContext<string | undefined>(undefined);

export const useMetaMaskAccount = () => useContext(MetaMaskAccountContext);

export function MetaMaskAccountProvider({ children }: IProps) {
    const [currentAccount, setCurrentAccount] = useState<string | undefined>();

    useEffect(() => {

        const updateAccountFromMetamask = async (): Promise<void> => {
            if (window.ethereum) {

                const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' });

                setCurrentAccount(accounts[0]);

                window.ethereum.on("accountsChanged", (accounts: any) => {
                    setCurrentAccount(accounts[0]);
                });
            }
        }
        updateAccountFromMetamask();
    }, []);

    return (
        <MetaMaskAccountContext.Provider value={currentAccount}>
            {children}
        </MetaMaskAccountContext.Provider>
    )
}