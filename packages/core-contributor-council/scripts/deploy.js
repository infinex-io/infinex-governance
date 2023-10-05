const { ethers } = require('hardhat');

async function main() {
  const ccTokenFactory = await ethers.getContractFactory('CoreContributorToken');

  const INITIAL_MEMBERS = [
    '0xBA4bB4e7102229d0f288F04BeA3eA7e61c9C2aB6',
    '0x003adee9f572ba3b9091f2ed0400040bcb3a7244',
    '0xccf10B8ff96579BeEFb2a75F674181E86D3c507E',
    '0xDFdDDe062A9CE719931Dfea3B618D192F3c3aabe',
  ];
  const OWNER = '0x2b60F290db1541AFF79b71b707453d36B01a86B8';

  const ccToken = await ccTokenFactory.deploy(OWNER, INITIAL_MEMBERS);
  console.log('cc token', ccToken.address);
  await ccToken.deployed();

  console.log('done.');
}

main().catch((e) => console.error(e));
