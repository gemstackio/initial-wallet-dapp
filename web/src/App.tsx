import { BigNumber, ethers, providers } from 'ethers';
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
  const [provider, setProvider] = useState<providers.Provider>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [networkId, setNetworkId] = useState<number>();

  const properEthFormat = (balance: BigNumber) => ethers.utils.formatEther(balance)

  const getContractBalance = async () => {
    const contractTotal = await contract?.getTotalContractAmount();
    console.log(properEthFormat(contractTotal));
    return contractTotal;
  }

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

    </div>
  );
};

export default App;