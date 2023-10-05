const { TASK_VERIFY_VERIFY } = require('@nomiclabs/hardhat-etherscan/dist/src/constants');

async function main() {
  const CC_TOKEN = '0xb178437340716381bF0990C15a6e26F3B2250b71';
  const INVESTOR_COUNTING = '0x3b56cf08535CC9cc812d19478795815599d1921D';
  const BLANK_COUNTING = '0xcc7C7a5ED4f068331a009FB7eCC1e7ABFa4ED9B1';
  const INVESTOR_TOKEN = '0xFCbA0f9A729C38D015C7e3D0F83427734328B8de';

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
