const logger = require('@synthetixio/core-js/utils/io/logger');
const prompter = require('@synthetixio/core-js/utils/io/prompter');
const { subtask } = require('hardhat/config');
const { SUBTASK_SET_CROSS_CHAIN_MERKLE_ROOT } = require('../task-names');
const path = require('path');
const fs = require('fs');

subtask(
  SUBTASK_SET_CROSS_CHAIN_MERKLE_ROOT,
  'Takes a snapshot of the election module, from the current block number'
).setAction(async ({ blockNumber }, hre) => {
  logger.subtitle('Setting Cross Chain Merkle Root');

  if (!blockNumber) {
    throw new Error('missing merkle root or block number');
  }

  const electionModuleFactory = await hre.ethers.getContractFactory(
    'contracts/modules/ElectionModule.sol:ElectionModule'
  );

  const contracts = Object.values(hre.deployer.deployment.general.contracts);
  const proxyData = contracts.find((data) => data.isProxy);
  const proxyAddress = proxyData.deployedAddress;

  const electionModule = await electionModuleFactory.attach(proxyAddress);

  let currentMerkleRoot;
  try {
    currentMerkleRoot = BigInt(await electionModule.getCrossChainDebtShareMerkleRoot());
  } catch (e) {
    currentMerkleRoot = BigInt(0);
  }

  let currentBlockNumber;
  try {
    currentBlockNumber = BigInt(await electionModule.getCrossChainDebtShareMerkleRootBlockNumber());
  } catch (e) {
    currentBlockNumber = BigInt(0);
  }

  const { merkleRoot } = require(path.join(
    __dirname,
    '../../scripts/data/' + blockNumber + '-debts.json'
  ));

  if (!merkleRoot) {
    throw new Error('could not find merkle root');
  }

  if (currentMerkleRoot !== BigInt(merkleRoot) || currentBlockNumber !== BigInt(blockNumber)) {
    await prompter.confirmAction('Update merkle root ' + merkleRoot + ' ' + blockNumber);

    logger.info('create merkle root tx');
    const filePath = path.join(__dirname, '../../../tx.csv');
    fs.appendFileSync(
      filePath,
      [
        electionModule.address,
        electionModule.interface.encodeFunctionData('setCrossChainDebtShareMerkleRoot', [
          merkleRoot,
          blockNumber,
        ]),
      ].join(',') + '\n'
    );
  }
});
