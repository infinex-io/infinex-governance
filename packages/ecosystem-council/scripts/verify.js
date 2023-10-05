const { TASK_VERIFY_VERIFY } = require('@nomiclabs/hardhat-etherscan/dist/src/constants');

async function main() {
  await hre.run(TASK_VERIFY_VERIFY, {
    address: '0xD2bB10738eC91390D77eeb1010AA1c466fC905Ee',
    contract: 'contracts/counting/BlankCounting.sol:BlankCounting',
  });

  console.log('done.');
}

main().catch((e) => console.error(e));
