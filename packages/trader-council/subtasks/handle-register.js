const logger = require('@synthetixio/core-js/utils/io/logger');
const { subtask } = require('hardhat/config');
const {
  SUBTASK_HANDLE_REGISTER,
  SUBTASK_SET_CROSS_CHAIN_MERKLE_ROOT,
} = require('@synthetixio/deployer/task-names');

subtask(SUBTASK_HANDLE_REGISTER, 'Register event').setAction(async (_, hre) => {
  logger.subtitle('Handling Register - Custom Logic Exists');

  await hre.run(SUBTASK_SET_CROSS_CHAIN_MERKLE_ROOT, {
    blockNumber: process.env.GOVERNANCE_MERKLE_ID,
  });
});
