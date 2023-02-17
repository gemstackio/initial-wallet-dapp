import ethers from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { IProps } from "../interfaces/IPros";
import { useWeb3ProviderContext } from "./Web3ProviderContext";

const SignerContext = React.createContext<ethers.Signer | undefined>(undefined);

export const useSigner = () => useContext(SignerContext);

export function SignerProvider({ children }: IProps) {
    const [signer, setSigner] = useState<ethers.Signer>();
    const provider = useWeb3ProviderContext();

    useEffect(() => {
        const getSigner = async (): Promise<void> => {
            if (typeof provider === 'object' && provider !== undefined) {
                const grabSigner = await provider?.getSigner();
                setSigner(grabSigner);
            }
        };
        getSigner();
    }, [provider]);

    return (
        <SignerContext.Provider value={signer}>
            {children}
        </SignerContext.Provider>
    )
}

