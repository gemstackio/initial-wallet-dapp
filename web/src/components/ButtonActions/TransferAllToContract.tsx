import { Contract, ethers } from "ethers";
import React, { Dispatch, MouseEventHandler, SetStateAction } from "react";

interface ButtonProps {
    signer: ethers.Signer | undefined;
    provider: ethers.providers.Web3Provider | undefined;
    contract: Contract | undefined;
}


const TransferAllToContract = ({ signer, provider, contract }: ButtonProps) => {

    const transferAllFromContract = async (signer: ethers.Signer, provider: ethers.providers.Web3Provider, contract: ethers.Contract): Promise<void> => {
        console.log(signer);
        console.log(provider);

        if (typeof signer === 'object' && provider !== undefined) {
            // must put a try catch to catch errors
            try {
                let transaction = await contract?.connect(signer).transferAll();
                transaction.wait().then(() => console.log(`Transaction complete! Hash: ${transaction.hash}`));
            } catch (error: any) {
                console.error();
            }
        }
    }

    const handleClick = (event: React.MouseEvent<Element>) => {
        event.preventDefault();
        if (typeof contract === 'object' && signer !== undefined && provider !== undefined)
            transferAllFromContract(signer, provider, contract);
    }


    return (
        <button onClick={handleClick}>Transfer All To Contract</button>
    );

}


export default TransferAllToContract;