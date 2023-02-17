import { ethers } from "hardhat";

async function main() {
  const NAME: string = 'Wallet Project';
  const SYMBOL: string = 'ETHD';

  const WalletContractFactory = await ethers.getContractFactory("WalletProj");

  const contract = await WalletContractFactory.deploy(NAME, SYMBOL);

  await contract.deployed();

  console.log(`Deployed Domain Contract at: ${contract.address}\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
