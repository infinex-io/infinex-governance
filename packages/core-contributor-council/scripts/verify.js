const { TASK_VERIFY_VERIFY } = require('@nomiclabs/hardhat-etherscan/dist/src/constants');
const { ethers } = require('hardhat');

async function main() {
  const PROXY_ADDRESS = '0xb446da55879238189614C2A34F04927362D4fB3b';
  const IMPLEMENTATION_ADDRESS =
    '0x' +
    (
      await ethers.provider.getStorageAt(
        PROXY_ADDRESS,
        '0x32402780481dd8149e50baad867f01da72e2f7d02639a6fe378dbd80b6bb446e'
      )
    ).substring(26);

  try {
    await hre.run(TASK_VERIFY_VERIFY, {
      address: PROXY_ADDRESS,
      contract: '@synthetixio/core-contracts/contracts/proxy/UUPSProxy.sol:UUPSProxy',
      constructorArguments: [IMPLEMENTATION_ADDRESS],
    });
  } catch (e) {
    console.log(e.message);
  }
  try {
    await hre.run(TASK_VERIFY_VERIFY, {
      address: IMPLEMENTATION_ADDRESS,
      contract: 'contracts/tokens/InvestorToken.sol:InvestorToken',
      constructorArguments: [],
    });
  } catch (e) {
    console.log(e.message);
  }

  console.log('done.');
}

main().catch((e) => console.error(e));
