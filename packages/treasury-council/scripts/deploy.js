const { ethers } = require('hardhat');

async function main() {
  const investorTokenFactory = await ethers.getContractFactory('InvestorToken');
  const investorCountingFactory = await ethers.getContractFactory('InvestorCounting');

  const INITIAL_INVESTORS = ['0x2b60F290db1541AFF79b71b707453d36B01a86B8'];
  const OWNER = '0x2b60F290db1541AFF79b71b707453d36B01a86B8';

  const investorToken = await investorTokenFactory.deploy(OWNER, INITIAL_INVESTORS);
  console.log('investor token', investorToken.address);
  await investorToken.deployed();

  const investorCounting = await investorCountingFactory.deploy(investorToken.address);
  console.log('investorCounting', investorCounting.address);
  await investorCounting.deployed();

  console.log('done.');
}

main().catch((e) => console.error(e));
