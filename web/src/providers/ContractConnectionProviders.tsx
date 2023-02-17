import { ContractProvider } from "../context/ContractContext";
import { MetaMaskAccountProvider } from "../context/MetaMaskAccountContext";
import { SignerProvider } from "../context/SignerContext";
import { Web3Provider } from "../context/Web3ProviderContext";
import { IProps } from "../interfaces/IPros";

export function ContractConnectionProviders({ children }: IProps) {
    return (
        <Web3Provider>
            <ContractProvider>
                <SignerProvider>
                    <MetaMaskAccountProvider>
                        {children}
                    </MetaMaskAccountProvider>
                </SignerProvider>
            </ContractProvider>
        </Web3Provider>
    )
}