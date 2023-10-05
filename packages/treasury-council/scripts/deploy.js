const { ethers } = require('hardhat');

async function main() {
  const signer = await ethers.getSigner();
  const investorTokenFactory = await ethers.getContractFactory('InvestorToken');
  const investorCountingFactory = await ethers.getContractFactory('InvestorCounting');
  const proxyFactory = await ethers.getContractFactory(
    '@synthetixio/core-contracts/contracts/proxy/UUPSProxy.sol:UUPSProxy'
  );

  let tx;
  let investorToken = await investorTokenFactory.deploy();
  await investorToken.deployed();

  const proxy = await proxyFactory.deploy(investorToken.address);
  console.log('investorToken', proxy.address);
  await proxy.deployed();
  investorToken = investorToken.attach(proxy.address);

  tx = await investorToken.nominateNewOwner(signer.address);
  console.log('nominating owner', tx.hash);
  await tx.wait();

  tx = await investorToken.acceptOwnership();
  console.log('accepting ownership', tx.hash);
  await tx.wait();

  tx = await investorToken.initialize('Infinex Benefactor NFT', 'INXBF');
  console.log('initialize', tx.hash);
  await tx.wait();

  const investorCounting = await investorCountingFactory.deploy(investorToken.address);
  console.log('investorCounting', investorCounting.address);
  await investorCounting.deployed();

  tx = await investorToken.mint('0x2b60F290db1541AFF79b71b707453d36B01a86B8');
  console.log('intital mint', tx.hash);
  await tx.wait();

  console.log('done.');
}

main().catch((e) => console.error(e));
