import IConfig from './config.json'
import { useEffect, useState } from 'react';
import './App.css';

// import the abi for our contract
import WalletProj from './abis/WalletProj.json';
// import the smart contract config file
import { BigNumber, ethers, providers } from "ethers";
// import AuthButton from './components/AuthButton';

interface IConfig {
  [key: string]: {
    WalletProj: {
      address: string;
    }
  }
}

const config: IConfig = require('./config.json');

function App() {

  const [account, setAccount] = useState<string>();
  const [network, setNetwork] = useState<providers.Network>();
  const [provider, setProvider] = useState<providers.Provider | undefined>(undefined);
  const [walletProjContract, setWalletProjContract] = useState<ethers.Contract>()


  async function getAccount() {
    let listOfAccounts: [string] = await window.ethereum.request({ 'method': 'eth_requestAccounts' });
    // console.log(listOfAccounts)
    setAccount(listOfAccounts[0]);
  };

  async function connectToProvider() {
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    getAccount();

    // Connect the project to the Web3Provider
    const newProvider = await new ethers.providers.Web3Provider(window.ethereum)
    await setProvider(newProvider);

    // console.log(config);

  };

  const handleGetProvider = async () => {
    console.log("fired")
    console.log(provider)
    if (provider instanceof providers.Provider) {
      getNetworkInfo(provider);
    }
  }

  const getNetworkInfo = async (provider: providers.Provider) => {
    // This pulls the network chain information and returns an object => {chainId: 31337, name: 'unknown'}
    const tempNetwork = await provider?.getNetwork();
    setNetwork(tempNetwork);
    console.log(tempNetwork);
  }
  const properEthFormat = (balance: BigNumber) => ethers.utils.formatEther(balance)

  const getAddressBalance = async () => {
    // Need to figure out how to use this:
    // https://felixgerschau.com/react-typescript-events/
    // e.preventDefault();
    if (typeof account === 'string') {
      const balance = await provider?.getBalance(account);

      if (balance instanceof BigNumber) {
        const properBalance = await ethers.utils.formatEther(balance)
        console.log(account + " has a balance of: " + properEthFormat(balance) + " eth");
      }
    }

  }

  const connectToSmartContract = async () => {
    console.log("Fired");
    console.log(provider);
    if (typeof network === 'object' && network !== null) {

      const WalletProjContractConnection = await new ethers.Contract(config[31337].WalletProj.address, WalletProj.abi, provider);

      setWalletProjContract(WalletProjContractConnection);

      await console.log("Wallet Contract: ", walletProjContract);
    }
  }

  const getContractBalance = async () => {
    const owner1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    const AMOUNT = ethers.utils.parseUnits('10', 'ether');

    const contractTotal = await walletProjContract?.getTotalContractAmount();
    // console.log(contractTotal);

    const properBalance = properEthFormat(contractTotal);
    console.log(properBalance);

    // const transaction = await walletProjContract?.connect(owner1).depositToContract({ value: AMOUNT });
    // console.log(transaction);

  }

  useEffect(() => {
    connectToProvider();
  }, [network]);

  // console.log(network)
  return (
    <div className="App">
      {/* <AuthButton account={account} setAccount={setAccount} /> */}
      <h1>
        {account}
      </h1>
      <div className='bttn-container'>


        {/* <button onClick={getAddressBalance}>Click to get account Balance</button> */}
        <button onClick={handleGetProvider}>1. Click to get Provider</button>
        <button onClick={connectToSmartContract}>2. Click to Connect to Smart Contract</button>
        <button onClick={getContractBalance}>3. Click to Contract Balance</button>
      </div>

    </div>
  );
}

export default App;
