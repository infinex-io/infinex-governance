const { ethers, network } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const investorTokenFactory = await ethers.getContractFactory('InvestorToken');
  const ccTokenFactory = await ethers.getContractFactory('CoreContributorToken');

  const deployment = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../deployment.' + network.name + '.json'), 'utf8')
  );

  const { TREASURY_SAFE, INFINEX_SAFE } = process.env;

  if (!TREASURY_SAFE || !INFINEX_SAFE) {
    throw new Error('missing env variables');
  }

  const investorToken = investorTokenFactory.attach(deployment.investorToken.address);
  const ccToken = ccTokenFactory.attach(deployment.ccToken.address);

  let tx;
  tx = await investorToken.nominateNewOwner(TREASURY_SAFE);
  console.log('nominated investor owner', tx.hash);
  await tx.wait();

  tx = await ccToken.nominateNewOwner(INFINEX_SAFE);
  console.log('nominated cc owner', tx.hash);
  await tx.wait();

  console.log('done.');
}

main().catch((e) => console.error(e));
