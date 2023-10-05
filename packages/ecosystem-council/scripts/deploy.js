const { ethers } = require('hardhat');

async function main() {
  const blankCountingFactory = await ethers.getContractFactory('BlankCounting');

  const counting = await blankCountingFactory.deploy();
  console.log('blank counting', counting.address);
  await counting.deployed();

  console.log('done.');
}

main().catch((e) => console.error(e));
