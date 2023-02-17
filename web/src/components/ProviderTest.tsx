import { useEffect } from 'react';
import { useContract } from '../context/ContractContext';
import { useMetaMaskAccount } from '../context/MetaMaskAccountContext';
import { useSigner } from '../context/SignerContext';
import { useWeb3ProviderContext } from '../context/Web3ProviderContext';

const ProviderTest = () => {
    const provider = useWeb3ProviderContext();
    const contract = useContract();
    const signer = useSigner();
    const currentMetaMaskAccount = useMetaMaskAccount();

    useEffect(() => {
        // console.log(provider);
        // console.log(contract);
        // console.log(signer);
        // console.log(currentMetaMaskAccount);

    }, [provider, contract, signer, currentMetaMaskAccount]);

    return (
        <div>

        </div>
    );
};

export default ProviderTest;