const { ethers, network } = require('hardhat');
const path = require('path');

async function main() {
  const investorTokenFactory = await ethers.getContractFactory('InvestorToken');
  const investorToken = await investorTokenFactory.deploy();

  investorToken.mint();
}

main().catch((e) => console.error(e));
