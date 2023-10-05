const { ethers } = require('hardhat');

async function main() {
  const signer = await ethers.getSigner();
  const ccTokenFactory = await ethers.getContractFactory('CoreContributorToken');
  const proxyFactory = await ethers.getContractFactory(
    '@synthetixio/core-contracts/contracts/proxy/UUPSProxy.sol:UUPSProxy'
  );

  const initialMembers = [
    '0xBA4bB4e7102229d0f288F04BeA3eA7e61c9C2aB6',
    '0x003adee9f572ba3b9091f2ed0400040bcb3a7244',
    '0xccf10B8ff96579BeEFb2a75F674181E86D3c507E',
    '0xDFdDDe062A9CE719931Dfea3B618D192F3c3aabe',
  ];

  let tx;
  let ccToken = await ccTokenFactory.deploy();
  console.log('cc token implementation', ccToken.address);
  await ccToken.deployed();

  const proxy = await proxyFactory.deploy(ccToken.address);
  console.log('cc token proxy', proxy.address);
  await proxy.deployed();
  ccToken = ccToken.attach(proxy.address);

  tx = await ccToken.nominateNewOwner(signer.address);
  console.log('nominating owner', tx.hash);
  await tx.wait();

  tx = await ccToken.acceptOwnership();
  console.log('accepting ownership', tx.hash);
  await tx.wait();

  tx = await ccToken.initialize('Infinex CC', 'INXCC', initialMembers);
  console.log('initialize', tx.hash);
  await tx.wait();

  console.log('done.');
}

main().catch((e) => console.error(e));
