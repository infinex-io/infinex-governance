const logger = require('@synthetixio/core-js/utils/io/logger');
const { subtask } = require('hardhat/config');
const { SUBTASK_POST_SYNC_SCHEDULE } = require('../task-names');
const path = require('path');
const fs = require('fs');
const { daysToSeconds } = require('@synthetixio/core-js/utils/misc/dates');

subtask(SUBTASK_POST_SYNC_SCHEDULE, 'Subtask post voting handler to do some logic').setAction(
  async ({ nominationDays, votingDays, epochDays }, hre) => {
    logger.subtitle('POST_SYNC_SCHEDULE');

    if (!nominationDays || !votingDays || !epochDays) {
      throw new Error('missing days data');
    }

    const contracts = Object.values(hre.deployer.deployment.general.contracts);
    const proxyData = contracts.find((data) => data.isProxy);
    const proxyAddress = proxyData.deployedAddress;

    const electionFactory = await hre.ethers.getContractFactory(
      'contracts/modules/ElectionModule.sol:ElectionModule'
    );

    const contract = electionFactory.attach(proxyAddress);

    const startDate = await contract.getEpochStartDate();

    const epochEndDate = daysToSeconds(epochDays) + +startDate;
    const votingStartDate = epochEndDate - daysToSeconds(votingDays);
    const nominationStartDate = votingStartDate - daysToSeconds(nominationDays);

    const txData = contract.interface.encodeFunctionData('modifyEpochSchedule', [
      nominationStartDate,
      votingStartDate,
      epochEndDate,
    ]);

    const filePath = path.join(__dirname, '../../../tx.csv');
    fs.appendFileSync(filePath, [contract.address, txData].join(',') + '\n');
  }
);
