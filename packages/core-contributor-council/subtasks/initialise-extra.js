const logger = require('@synthetixio/core-js/utils/io/logger');
const { subtask } = require('hardhat/config');
const { SUBTASK_INITIALISE_EXTRA } = require('@synthetixio/deployer/task-names');

subtask(SUBTASK_INITIALISE_EXTRA, 'Initialises extra custom logic').setAction(async (_, hre) => {
  logger.subtitle('Initialising Extra Custom Logic');

  const contracts = Object.values(hre.deployer.deployment.general.contracts);
  const proxyData = contracts.find((data) => data.isProxy);
  const proxyAddress = proxyData.deployedAddress;

  const electionModuleFactory = await hre.ethers.getContractFactory(
    'contracts/modules/ElectionModule.sol:ElectionModule'
  );

  const contract = electionModuleFactory.attach(proxyAddress);

  const { CC_TOKEN } = process.env;

  if (!CC_TOKEN) {
    throw new Error('missing CC_TOKEN');
  }

  if (BigInt(await contract.getCoreContributorToken()) !== BigInt(CC_TOKEN)) {
    tx = await contract.setCoreContributorToken(CC_TOKEN);
    logger.info('update core contributor token', tx.hash);
    await tx.wait();
  }
});
