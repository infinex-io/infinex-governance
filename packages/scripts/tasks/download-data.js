const { task } = require('hardhat/config');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

task(
  'download-data',
  'Get all the addresses with their debts querying to the SynthetixDebtShare contract'
).setAction(async () => {
  const {
    data: { message: debts },
  } = await axios.get(
    'https://ny0v2nh4u2.execute-api.ap-southeast-2.amazonaws.com/dev/points_opera_XrubyX_33'
  );

  const id = Math.floor(Date.now() / 1000);
  const output = path.join(__dirname, '../data/' + id + '-debts.json');

  fs.writeFileSync(output, JSON.stringify(debts));

  console.log('GOVERNANCE_MERKLE_ID=' + id);
});
