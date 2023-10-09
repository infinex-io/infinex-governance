const logger = require('@synthetixio/core-js/utils/io/logger');
const prompter = require('@synthetixio/core-js/utils/io/prompter');
const { subtask } = require('hardhat/config');
const { SUBTASK_TAKE_SNAPSHOT } = require('../task-names');

subtask(
  SUBTASK_TAKE_SNAPSHOT,
  'Takes a snapshot of the election module, from the current block number'
).setAction(async (_, hre) => {
  logger.subtitle('Taking Snapshot');

  const electionModuleFactory = await hre.ethers.getContractFactory(
    'contracts/modules/ElectionModule.sol:ElectionModule'
  );

  const contracts = Object.values(hre.deployer.deployment.general.contracts);
  const proxyData = contracts.find((data) => data.isProxy);
  const proxyAddress = proxyData.deployedAddress;

  const electionModule = await electionModuleFactory.attach(proxyAddress);

  await prompter.confirmAction('Take Snapshot');

  let tx;
  if ((await electionModule.getCurrentPeriod()).eq(1)) {
    let debtShareSnapshotId;
    try {
      debtShareSnapshotId = BigInt(await electionModule.getDebtShareSnapshotId());
    } catch (e) {
      debtShareSnapshotId = BigInt(0);
    }

    if (debtShareSnapshotId === BigInt(0)) {
      tx = await electionModule.setDebtShareSnapshotId(await ethers.provider.getBlockNumber());
      logger.debug('set snapshot id', tx.hash);
      await tx.wait();
      logger.debug('done');
    } else {
      logger.debug('snapshot already staken');
    }
  } else {
    logger.debug('invalid time period');
  }
});
