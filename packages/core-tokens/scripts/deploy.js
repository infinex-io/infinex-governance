const { ethers, network } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const investorTokenFactory = await ethers.getContractFactory('InvestorToken');
  const ccTokenFactory = await ethers.getContractFactory('CoreContributorToken');
  const blankCountingFactory = await ethers.getContractFactory('BlankCounting');

  const INITIAL_MEMBERS = (process.env.INITIAL_MEMBERS || '').split(',').filter(Boolean);
  const INITIAL_INVESTORS = (process.env.INITIAL_INVESTORS || '').split(',').filter(Boolean);

  const ccToken = await ccTokenFactory.deploy(INITIAL_MEMBERS);
  console.log('cc token', ccToken.address);
  await ccToken.deployed();

  const counting = await blankCountingFactory.deploy();
  console.log('blank counting', counting.address);
  await counting.deployed();

  const investorToken = await investorTokenFactory.deploy(INITIAL_INVESTORS);
  console.log('investor token', investorToken.address);
  await investorToken.deployed();

  console.log('done.');

  fs.writeFileSync(
    path.join(__dirname, '../deployment.' + network.name + '.json'),
    JSON.stringify(
      {
        investorToken: {
          address: investorToken.address,
          contract: 'contracts/InvestorToken.sol:InvestorToken',
          constructorArguments: [INITIAL_INVESTORS],
          tx: investorToken.deployTransaction.hash,
        },
        ccToken: {
          address: ccToken.address,
          contract: 'contracts/CoreContributorToken.sol:CoreContributorToken',
          constructorArguments: [INITIAL_MEMBERS],
          tx: ccToken.deployTransaction.hash,
        },
        blankCounting: {
          address: counting.address,
          contract: 'contracts/BlankCounting.sol:BlankCounting',
          constructorArguments: [],
          tx: counting.deployTransaction.hash,
        },
      },
      undefined,
      4
    )
  );
}

main().catch((e) => console.error(e));
