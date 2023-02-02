import IConfig from './config.json'
import { useEffect, useState } from 'react';
import './App.css';

// import the abi for our contract
import WalletProj from './abis/WalletProj.json';
// import the smart contract config file
import { ethers, providers } from "ethers";
// import AuthButton from './components/AuthButton';

interface IConfig {
  [key: string]: {
    WalletProj: {
      address: string;
    }
  }
}

interface INetwork {

}

const config: IConfig = require('./config.json');

function App() {

  const [account, setAccount] = useState<string>();
  const [network, setNetwork] = useState<object | string>();
  const [provider, setProvider] = useState<providers.Provider | undefined>(undefined);

  // const [user, setUser] = useState<{ name: string, email: string }>({ name: '', email: '' });

  // const [count, setCount] = useState<number>(0);

  async function getAccount() {
    let listOfAccounts: [string] = await window.ethereum.request({ 'method': 'eth_requestAccounts' });
    setAccount(listOfAccounts[0]);
  };

  async function connectToProvider() {
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    getAccount();

    // Connect the project to the Web3Provider
    const newProvider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(newProvider);

    // This pulls the network chain information and returns an object => {chainId: 31337, name: 'unknown'}
    const tempNetwork = await provider?.getNetwork() ?? "Provider not yet defined";
    setNetwork(tempNetwork);
    // console.log(tempNetwork);

    // console.log(config);


    const walletProjContract = new ethers.Contract(config[network?.chainId].WalletProj.address, WalletProj, provider)
  };

  useEffect(() => {
    connectToProvider();
  }, []);

  console.log(network);

  return (
    <div className="App">
      {/* <AuthButton account={account} setAccount={setAccount} /> */}
      <h1>
        {account}
      </h1>

    </div>
  );
}

export default App;
