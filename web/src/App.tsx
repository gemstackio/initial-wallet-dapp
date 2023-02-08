import { BigNumber, ethers, providers, Signer } from 'ethers';
import { useEffect, useState } from 'react';
import IConfig from './config.json'
import ABI from './abis/WalletProj.json'
import Button from './components/Button';


interface IConfig {
  [key: string]: {
    WalletProj: {
      address: string;
    }
  }
}

const config: IConfig = require('./config.json');

const getNetworkId = async (provider: providers.Provider) => {
  const networkId = await provider.getNetwork().then((network) => network.chainId);
  return networkId;
};

const App = () => {
  // It is very important to make sure that we are setting the proper provider type here
  const [provider, setProvider] = useState<providers.Web3Provider>();
  // Having this line of code caused an issue due to the fact that there are a few different providers that you can use to connect to the network.
  // Based on the provider you use the interface provided changes accordingly. Meaning a method or property that is available on the Web3Provider can differ from the JsonRpcProvider
  // const [provider, setProvider] = useState<providers.Provider>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [networkId, setNetworkId] = useState<number>();
  const [mainAccount, setMainAccount] = useState<string>();
  const [signer, setSigner] = useState<Signer>();

  const properEthFormat = (balance: BigNumber) => ethers.utils.formatEther(balance)

  const getContractBalance = async () => {
    const contractTotal = await contract?.getTotalContractAmount();
    console.log(properEthFormat(contractTotal));
    return contractTotal;
  }

  const depositToContract = async () => {
    console.log(mainAccount);

    const AMOUNT = ethers.utils.parseUnits('10', 'ether');
    if (typeof signer === 'object' && signer !== undefined) {
      // Connecting the contract with the signer
      const connectedContract = await contract?.connect(signer);
      const transaction = await connectedContract?.depositToContract({ value: AMOUNT });
      transaction.wait();
    }
  };


  // This first useEffect handles getting the initial provider info
  useEffect(() => {
    const connectToProvider = async () => {
      // Connect to the Web3Provider
      const newProvider = await new ethers.providers.Web3Provider(window.ethereum);
      setProvider(newProvider);
    };

    connectToProvider();
  }, []);

  // Then this useEffect is listening for a state change to happen to the provider variable
  // Once a change is detected it then runs the code to obtain the networkId and contract interface
  useEffect(() => {
    const connectToRest = async () => {

      if (typeof provider === 'object' && provider !== undefined) {
        // Get the ID
        const id = await getNetworkId(provider);
        setNetworkId(id);

        // Connect to the smart contract
        const contractConnection = new ethers.Contract(config[id].WalletProj.address, ABI.abi, provider);
        setContract(contractConnection);

        // Grabbing the list of signers from MetaMask
        // This is a readonly list that can be used to see which accounts are loaded
        // We can not use this to connect to a smart contract
        const accounts = await provider?.listAccounts();
        setMainAccount(accounts[0]);

        // Creating a signer object so that we are able to eventually connect to a smart contract as the current signer in MetaMask
        const grabSigner = await provider?.getSigner();
        setSigner(grabSigner);
      }
    };

    connectToRest();
  }, [provider]);


  return (
    <div className="App">
      <h1>Connected to Smart Contract!</h1>
      {(!networkId) ? <p>loading network</p> : <p>{networkId}</p>}
      {(!contract) ? <p>loading contract</p> : <p>{contract.address}</p>}


      <Button callBack={getContractBalance} title={"Click to Contract Balance"} />
      <Button callBack={depositToContract} title={"Signer"} />

    </div>
  );
};

export default App;