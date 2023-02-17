import './App.css';
import ContractBalance from './components/ContractBalance';
import ContractDetails from './components/ContractDetails';
import DepositToContract from './components/DepositToContract';
import ProviderTest from './components/ProviderTest';
import WithdrawAmountFromContract from './components/WithdrawAmountFromContract';
import { ContractConnectionProviders } from './providers/ContractConnectionProviders';

function App() {

  return (
    <div>
      <ContractConnectionProviders>
        {/* <ProviderTest /> */}
        <ContractDetails />
        <ContractBalance />
        <DepositToContract />
        <WithdrawAmountFromContract />
      </ContractConnectionProviders>
    </div>
  );
}

export default App;
