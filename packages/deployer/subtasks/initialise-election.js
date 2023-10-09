const logger = require('@synthetixio/core-js/utils/io/logger');
const prompter = require('@synthetixio/core-js/utils/io/prompter');
const { subtask } = require('hardhat/config');
const { SUBTASK_INITIALISE_ELECTION } = require('../task-names');
const { daysToSeconds } = require('@synthetixio/core-js/utils/misc/dates');

const isoToSeconds = (time) => Math.round(new Date(time).getTime() / 1000);

subtask(SUBTASK_INITIALISE_ELECTION, 'Initialises the election module').setAction(
  async (
    {
      nftName,
      nftSymbol,
      nominationStartDate,
      nominationDays,
      votingDays,
      totalMembers,
      debtShareContract,
    },
    hre
  ) => {
    logger.subtitle('Initialising Election Module');

    const contracts = Object.values(hre.deployer.deployment.general.contracts);
    const proxyData = contracts.find((data) => data.isProxy);
    const proxyAddress = proxyData.deployedAddress;

    const electionModuleFactory = await hre.ethers.getContractFactory(
      'contracts/modules/ElectionModule.sol:ElectionModule'
    );

    const contract = electionModuleFactory.attach(proxyAddress);

    const minNominationDuration = daysToSeconds(2);
    const minVotingDuration = daysToSeconds(2);
    const minEpochDuration = daysToSeconds(7);

    const MAX_UINT64 = BigInt(2) ** BigInt(64) - BigInt(1);

    let tx;

    if (BigInt(await contract.getCouncilToken()) !== BigInt(0)) {
      logger.info('already initialised');
    }
    const nominationStart = isoToSeconds(nominationStartDate);
    const votingStart = daysToSeconds(+nominationDays) + nominationStart;
    const epochEnd = daysToSeconds(+votingDays) + votingStart;

    if (
      daysToSeconds(votingDays) <= minVotingDuration ||
      daysToSeconds(nominationDays) <= minNominationDuration ||
      epochEnd - Math.round(Date.now() / 1000) <= minEpochDuration
    ) {
      await hre.run(SUBTASK_INITIALISE_ELECTION, {
        nftName,
        nftSymbol,
        nominationStartDate,
        nominationDays: 7,
        votingDays: 7,
        totalMembers,
        debtShareContract,
      });

      tx = await contract.setMinEpochDurations(1, 1, 1);
      logger.debug('set min epoch durations', tx.hash);
      await tx.wait();

      tx = await contract.setMaxDateAdjustmentTolerance(MAX_UINT64);
      logger.debug('set max date', tx.hash);
      await tx.wait();

      tx = await contract.tweakEpochSchedule(nominationStart, votingStart, epochEnd);
      logger.debug('tweak start dates', tx.hash);
      await tx.wait();
    }

    await prompter.confirmAction('Initialise Election Module');

    tx = await contract[
      'initializeElectionModule(string,string,address[],uint8,uint64,uint64,uint64,address)'
    ](
      nftName,
      nftSymbol,
      Array.from(Array(totalMembers)).map(
        (_, index) => '0x' + (index + 1).toString().padStart(40, '0')
      ),
      totalMembers,
      nominationStart,
      votingStart,
      epochEnd,
      debtShareContract
    );
    logger.info('initialised contract', tx.hash);
    await tx.wait();
  }
);
