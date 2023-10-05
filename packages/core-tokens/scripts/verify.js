const { TASK_VERIFY_VERIFY } = require('@nomiclabs/hardhat-etherscan/dist/src/constants');

async function main() {
  const CC_TOKEN = '0x582b52C31Ebb5F16Fd31fbA034A35394F90f9CD9';
  const INVESTOR_COUNTING = '0x8ac262c59f8fE17A08637136491Ef52934118c39';
  const BLANK_COUNTING = '0x7cfEeC25eBA60a4B43D734dBdef4F10Dd95A0feD';
  const INVESTOR_TOKEN = '0x4535bD1D34B9C434c85aEBf848E9fdCD84D22C23';

  const INITIAL_MEMBERS = [
    '0xBA4bB4e7102229d0f288F04BeA3eA7e61c9C2aB6',
    '0x003adee9f572ba3b9091f2ed0400040bcb3a7244',
    '0xccf10B8ff96579BeEFb2a75F674181E86D3c507E',
    '0xDFdDDe062A9CE719931Dfea3B618D192F3c3aabe',
  ];
  const INITIAL_INVESTORS = ['0x2b60F290db1541AFF79b71b707453d36B01a86B8'];
  const OWNER = '0x2b60F290db1541AFF79b71b707453d36B01a86B8';

  try {
    await hre.run(TASK_VERIFY_VERIFY, {
      address: INVESTOR_TOKEN,
      contract: 'contracts/InvestorToken.sol:InvestorToken',
      constructorArguments: [OWNER, INITIAL_INVESTORS],
    });
  } catch (e) {
    console.log(e.message);
  }
  try {
    await hre.run(TASK_VERIFY_VERIFY, {
      address: INVESTOR_COUNTING,
      contract: 'contracts/InvestorCounting.sol:InvestorCounting',
      constructorArguments: [INVESTOR_TOKEN],
    });
  } catch (e) {
    console.log(e.message);
  }

  try {
    await hre.run(TASK_VERIFY_VERIFY, {
      address: CC_TOKEN,
      contract: 'contracts/CoreContributorToken.sol:CoreContributorToken',
      constructorArguments: [OWNER, INITIAL_MEMBERS],
    });
  } catch (e) {
    console.log(e.message);
  }

  try {
    await hre.run(TASK_VERIFY_VERIFY, {
      address: BLANK_COUNTING,
      contract: 'contracts/BlankCounting.sol:BlankCounting',
    });
  } catch (e) {
    console.log(e.message);
  }

  console.log('done.');
}

main().catch((e) => console.error(e));
