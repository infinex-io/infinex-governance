const { TASK_VERIFY_VERIFY } = require('@nomiclabs/hardhat-etherscan/dist/src/constants');
const fs = require('fs');
const { network } = require('hardhat');
const path = require('path');

async function main() {
  const deployment = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../deployment.' + network.name + '.json'), 'utf8')
  );

  for (const [key, data] of Object.entries(deployment)) {
    try {
      console.log('verifying', key);
      await hre.run(TASK_VERIFY_VERIFY, data);
    } catch (e) {
      console.log(e.message);
    }
  }

  console.log('done.');
}

main().catch((e) => console.error(e));
