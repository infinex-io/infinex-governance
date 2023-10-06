const { ethers } = require('hardhat');

async function main() {
  const investorTokenFactory = await ethers.getContractFactory('InvestorToken');
  const investorCountingFactory = await ethers.getContractFactory('InvestorCounting');
  const ccTokenFactory = await ethers.getContractFactory('CoreContributorToken');
  const blankCountingFactory = await ethers.getContractFactory('BlankCounting');

  const INITIAL_MEMBERS = [
    '0xBA4bB4e7102229d0f288F04BeA3eA7e61c9C2aB6',
    '0x003adee9f572ba3b9091f2ed0400040bcb3a7244',
    '0xccf10B8ff96579BeEFb2a75F674181E86D3c507E',
    '0xDFdDDe062A9CE719931Dfea3B618D192F3c3aabe',
    '0x1BE960932CbC08f29cf70349c0a0547c75A297BC',
  ];
  const INITIAL_INVESTORS = [
    '0xBA4bB4e7102229d0f288F04BeA3eA7e61c9C2aB6',
    '0x003adee9f572ba3b9091f2ed0400040bcb3a7244',
    '0xccf10B8ff96579BeEFb2a75F674181E86D3c507E',
    '0xDFdDDe062A9CE719931Dfea3B618D192F3c3aabe',
    '0x1BE960932CbC08f29cf70349c0a0547c75A297BC',
  ];
  const INVESTOR_OWNER = '0x5c99fCB8E96601c51be8002F9E89fCE8b5f0B682'; // Treasury Safe
  const CC_OWNER = '0xf23d8DDc368089a1D6A97bc385c2ca885cd9B2f3'; // infinex safe

  const gasPrice = undefined; // (await ethers.provider.getGasPrice()).mul(2);

  const ccToken = await ccTokenFactory.deploy(CC_OWNER, INITIAL_MEMBERS, { gasPrice });
  console.log('cc token', ccToken.address);
  await ccToken.deployed();

  const counting = await blankCountingFactory.deploy({ gasPrice });
  console.log('blank counting', counting.address);
  await counting.deployed();

  const investorToken = await investorTokenFactory.deploy(INVESTOR_OWNER, INITIAL_INVESTORS, {
    gasPrice,
  });
  console.log('investor token', investorToken.address);
  await investorToken.deployed();

  const investorCounting = await investorCountingFactory.deploy(investorToken.address, {
    gasPrice,
  });
  console.log('investorCounting', investorCounting.address);
  await investorCounting.deployed();

  console.log('done.');
}

main().catch((e) => console.error(e));
