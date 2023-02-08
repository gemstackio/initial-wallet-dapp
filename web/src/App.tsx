import { BigNumber, ethers, providers, Signer } from 'ethers';
import { useEffect, useState } from 'react';
import IConfig from './config.json'
import ABI from './abis/WalletProj.json'
import Button from './components/Button';
import SendFunds from './components/SendFunds';

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

  const depositToContract = async (amount: string): Promise<void> => {
    const AMOUNT = ethers.utils.parseUnits(amount, 'ether');

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
          setCurrentAccount(accounts[0]);
        });
      }
    }
    updateAccountFromMetamask();
  }, []);

  // TRANSFER ALL COMPONENT
  // interface IError{
  //   code: number;
  //   data: {
  //     code: number;
  //     data: {
  //       data: string;
  //       message: string;
  //     }
  //   };
  //   message: string;
  // }
  // function transferAll() public onlyOwner
  const transferAllFromContract = async (): Promise<void> => {
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

  // function transferAmountFromContract(uint _transferAmount, address _someone) public onlyOwner contractHasValidBalance(_transferAmount)
  const transferAnAmountFromContract = async (): Promise<void> => {
    if (typeof signer === 'object' && provider !== undefined) {
      // must put a try catch to catch errors
      try {
        // just setting the amount to 10 ether for now
        const transferAmount = ethers.utils.parseUnits("10", 'ether');
        // setting the address to send to
        const recipientAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        let transaction = await contract?.connect(signer).transferAmountFromContract(transferAmount, recipientAddress);
        transaction.wait().then(() => console.log(`Transaction complete! Hash: ${transaction.hash}`));
        /*
        const connectedContract = await contract?.connect(signer);
        try {
          // using our smart contract method to send 
          const transaction = await connectedContract?.depositToContract({ value: AMOUNT });

        */
      } catch (error: any) {
        console.dir(error)
      }
    }
  }

  // function addAddressToWhitelist(address _address) public onlyOwner addressIsNotWhiteListed(_address){

  const addAddressToContractWhitelist = async () => {

    if (typeof signer === 'object' && provider !== undefined) {
      try {
        console.log("Fire");
        const addressToAdd = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        let transaction = await contract?.connect(signer).addAddressToWhitelist(addressToAdd);
        transaction.wait().then(() => console.log(`Transaction complete! Hash: ${transaction.hash}`));
      } catch (error) {
        console.error();
      }
    }
  }

  const checkIfAccountIsWhitelisted = async () => {

    const addressToAdd = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const isAddressWhitelisted: boolean = await contract?.checkIfWhitelisted(addressToAdd); ////.whitelistedAddresses(addressToAdd)
    console.log(isAddressWhitelisted);

  }

  return (
    <div className="App">
      <h1>Connected to Smart Contract!</h1>
      <ul>
        {(!networkId) ? <li>loading network</li> : <li>Network ID: {networkId}</li>}
        {(!contract) ? <li>loading contract</li> : <li>Contract Address: {contract.address}</li>}
        {(!contractBalance) ? <li>Click button</li> : <li>Current Contract Balance: {contractBalance} eth</li>}
        {(!currentAccount) ? <li>No Current Account Address</li> : <li>Current Account Address: {currentAccount}</li>}

      </ul>
      <Button callBack={getContractBalance} title={"Click to Contract Balance"} />
      <Button callBack={transferAllFromContract} title={"Click To Transfer All From Contract"} />
      <Button callBack={transferAnAmountFromContract} title={"Click To Transfer 10 Ether From Contract To Recipient"} />
      <Button callBack={addAddressToContractWhitelist} title={"Click To Whitelist an Account"} />
      <Button callBack={checkIfAccountIsWhitelisted} title={"Click To Check If Account is Whitelisted"} />
      {/* <Button callBack={depositToContract} title={"Send Eth to Contract"} /> */}

      <div>
        <br />
        <br />
        <br />
      </div>

      <SendFunds callBack={depositToContract} />
    </div>
  );
};

export default App;