import { ethers } from "ethers";

interface GetContractBalanceProps {
    walletProjContract: ethers.Contract | undefined
}

function GetContractBalance({ walletProjContract }: GetContractBalanceProps) {

    const owner1 = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    const AMOUNT = ethers.utils.parseUnits('10', 'ether');

    console.log(walletProjContract)

    const handleClick = async () => {
        const contractTotal: number = await walletProjContract?.getTotalContractAmount();
        console.log(contractTotal);

        const transaction = await walletProjContract?.connect(owner1).depositToContract({ value: AMOUNT });
        // console.log(transaction);

    }

    return (
        <div>
            <button onClick={handleClick}>Click Me 2</button>
        </div>
    );
}

export default GetContractBalance;