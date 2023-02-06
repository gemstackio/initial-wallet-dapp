import { ethers } from "hardhat";
import { Contract } from 'ethers';


const tokens = (n: number) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

  const NAME: string = 'Wallet Project';
  const SYMBOL: string = 'ETHD';

  const WalletProj = await ethers.getContractFactory("WalletProj");

  const walletProj: Contract = await WalletProj.deploy(NAME, SYMBOL);
  await walletProj.deployed();

  console.log(`Deployed Domain Contract at: ${walletProj.address}\n`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
