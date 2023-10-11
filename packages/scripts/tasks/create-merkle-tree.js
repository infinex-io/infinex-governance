const { task } = require('hardhat/config');
const fs = require('fs');
const { parseBalanceMap } = require('@synthetixio/core-js/utils/merkle-tree/parse-balance-tree');
const path = require('path');

task('create-merkle-tree', 'Creates the merkle tree for the debt contract')
  .addParam('filename', 'Filename of the user debts.')
  .setAction(async ({ filename }) => {
    console.log(filename);
    const data = require(path.join(__dirname, '../data', filename));
    const tree = parseBalanceMap(data.debts);
    const newFilepath = path.join(__dirname, '../data', filename.replace('-users', ''));
    fs.writeFileSync(
      path.join(__dirname, '../data', filename.replace('-users', '')),
      JSON.stringify(tree)
    );
    return newFilepath;
  });
