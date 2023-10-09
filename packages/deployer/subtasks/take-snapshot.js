const logger = require('@synthetixio/core-js/utils/io/logger');
const prompter = require('@synthetixio/core-js/utils/io/prompter');
const { subtask } = require('hardhat/config');
const { SUBTASK_TAKE_SNAPSHOT } = require('../task-names');

subtask(
  SUBTASK_TAKE_SNAPSHOT,
  'Takes a snapshot of the election module, from the current block number'
).setAction(async ({ snapshotId }, hre) => {
  logger.subtitle('Taking Snapshot');

  if (!snapshotId) {
    throw new Error('missing snapshot id');
  }

  const electionModuleFactory = await hre.ethers.getContractFactory(
    'contracts/modules/ElectionModule.sol:ElectionModule'
  );

  const contracts = Object.values(hre.deployer.deployment.general.contracts);
  const proxyData = contracts.find((data) => data.isProxy);
  const proxyAddress = proxyData.deployedAddress;

  const electionModule = await electionModuleFactory.attach(proxyAddress);

  if (!snapshotId) {
    try {
      const address = await electionModule.getDebtShareContract();
      const SynthetixDebtShare = await hre.ethers.getContractAt(
        [
          {
            constant: true,
            inputs: [],
            name: 'currentPeriodId',
            outputs: [{ internalType: 'uint128', name: '', type: 'uint128' }],
            payable: false,
            stateMutability: 'view',
            type: 'function',
          },
        ],
        address
      );
      snapshotId = await SynthetixDebtShare.currentPeriodId();
    } catch (e) {
      logger.error('error retrieving current period');
    }
  }

  let tx;
  if ((await electionModule.getCurrentPeriod()).eq(1) && snapshotId) {
    let debtShareSnapshotId;
    try {
      debtShareSnapshotId = BigInt(await electionModule.getDebtShareSnapshotId());
    } catch (e) {
      debtShareSnapshotId = BigInt(0);
    }

    if (debtShareSnapshotId !== BigInt(snapshotId)) {
      await prompter.confirmAction('Take Snapshot ' + snapshotId);

      tx = await electionModule.setDebtShareSnapshotId(snapshotId);
      logger.info('set snapshot id ' + tx.hash);
      await tx.wait();
      logger.info('done');
    } else {
      logger.info('snapshot already staken');
    }
  } else {
    logger.info('invalid time period');
  }
});
