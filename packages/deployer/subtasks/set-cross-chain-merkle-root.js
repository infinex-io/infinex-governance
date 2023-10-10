const logger = require('@synthetixio/core-js/utils/io/logger');
const prompter = require('@synthetixio/core-js/utils/io/prompter');
const { subtask } = require('hardhat/config');
const { SUBTASK_SET_CROSS_CHAIN_MERKLE_ROOT } = require('../task-names');

subtask(
  SUBTASK_SET_CROSS_CHAIN_MERKLE_ROOT,
  'Takes a snapshot of the election module, from the current block number'
).setAction(async ({ merkleRoot, blockNumber }, hre) => {
  logger.subtitle('Setting Cross Chain Merkle Root');

  if (!merkleRoot || !blockNumber) {
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

  let tx;
  if (currentMerkleRoot !== BigInt(merkleRoot) || currentBlockNumber !== BigInt(blockNumber)) {
    await prompter.confirmAction('Update merkle root ' + merkleRoot + ' ' + blockNumber);

    tx = await electionModule.setCrossChainDebtShareMerkleRoot(merkleRoot, blockNumber);
    logger.info('updating merkle root ' + tx.hash);
    await tx.wait();
  }
});
