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
  const [currentMetaMaskAccount, setCurrentMetaMaskAccount] = useState<string>();
  const [signer, setSigner] = useState<Signer>();
  const [contractBalance, setContractBalance] = useState<string>();
  const [currentAccount, setCurrentAccount] = useState<string>();

  const properEthFormat = (balance: BigNumber): string => ethers.utils.formatEther(balance);

  const getContractBalance = async (): Promise<string> => {
    const contractTotal: BigNumber = await contract?.getTotalContractAmount();
    const properFormattedBalance = properEthFormat(contractTotal);
    console.log(properEthFormat(contractTotal));
    setContractBalance(properFormattedBalance);
    return properFormattedBalance;
  };

  const depositToContract = async (): Promise<void> => {
    const AMOUNT = ethers.utils.parseUnits('10', 'ether');
    if (typeof signer === 'object' && signer !== undefined) {
      // Connecting the contract with the signer
      const connectedContract = await contract?.connect(signer);
      try {
        // using our smart contract method to send 
        const transaction = await connectedContract?.depositToContract({ value: AMOUNT });
        console.log(transaction);

        transaction.wait().then(() => {
          console.log(`Transaction complete! Hash: ${transaction.hash}`)
        });
      } catch (error) {
        console.log(error);
      }
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
  useEffect(() => {
    const connectToRest = async (): Promise<void> => {

      // Once a change is detected it then runs the code to:
      if (typeof provider === 'object' && provider !== undefined) {
        // 1. Obtain the networkId
        const id = await getNetworkId(provider);
        setNetworkId(id);

        // Connect to the smart contract and receive a Contract interface
        const contractConnection = new ethers.Contract(config[id].WalletProj.address, ABI.abi, provider);
        setContract(contractConnection);

        // 3. The current account in metaMask
        // Grabbing the list of signers from MetaMask
        // This is a readonly list that can be used to see which accounts are loaded
        // We can not use this to connect to a smart contract
        const accounts = await provider?.listAccounts();
        setCurrentMetaMaskAccount(accounts[0]);

        // 4. Creates a singer object that we can use to connect to smart contracts and send transaction
        // Creating a signer object so that we are able to eventually connect to a smart contract as the current signer in MetaMask
        const grabSigner = await provider?.getSigner();
        setSigner(grabSigner);
      }
    };
    connectToRest();
  }, [provider]);

  useEffect(() => {
    const updateAccountFromMetamask = async (): Promise<void> => {
      if (window.ethereum) {
        // getting and setting the initial account from Metamask
        const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' });
        setCurrentAccount(accounts[0]);

        // Update the current address on account change in Metamask
        window.ethereum.on("accountsChanged", (accounts: any) => {
          console.log(accounts);
          setCurrentAccount(accounts[0]);
        });
      }
    }
    updateAccountFromMetamask();
  }, []);

  return (
    <div className="App">
      <h1>Connected to Smart Contract!</h1>
      {(!currentAccount) ? <p>No Current Account Address</p> : <p>Current Account Address: {currentAccount}</p>}
      {(!networkId) ? <p>loading network</p> : <p>{networkId}</p>}
      {(!contract) ? <p>loading contract</p> : <p>{contract.address}</p>}
      {(!contractBalance) ? <p>Click button</p> : <p>{contractBalance}</p>}
      <Button callBack={getContractBalance} title={"Click to Contract Balance"} />
      <Button callBack={depositToContract} title={"Send Eth to Contract"} />
    </div>
  );
};

export default App;