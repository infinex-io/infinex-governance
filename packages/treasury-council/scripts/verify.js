const { TASK_VERIFY_VERIFY } = require('@nomiclabs/hardhat-etherscan/dist/src/constants');

async function main() {
  const TOKEN_ADDRESS = '0xb446da55879238189614C2A34F04927362D4fB3b';
  const COUNTING_ADDRESS = '0x34c78F826bA5750Ad17C77aAF7737359eA67cFd6';

  const INITIAL_INVESTORS = ['0x2b60F290db1541AFF79b71b707453d36B01a86B8'];
  const OWNER = '0x2b60F290db1541AFF79b71b707453d36B01a86B8';

  try {
    await hre.run(TASK_VERIFY_VERIFY, {
      address: TOKEN_ADDRESS,
      contract: 'contracts/tokens/InvestorToken.sol:InvestorToken',
      constructorArguments: [OWNER, INITIAL_INVESTORS],
    });
  } catch (e) {
    console.log(e.message);
  }
  try {
    await hre.run(TASK_VERIFY_VERIFY, {
      address: COUNTING_ADDRESS,
      contract: 'contracts/counting/InvestorCounting.sol:InvestorCounting',
      constructorArguments: [TOKEN_ADDRESS],
    });
  } catch (e) {
    console.log(e.message);
  }

  console.log('done.');
}

main().catch((e) => console.error(e));
