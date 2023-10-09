const logger = require('@synthetixio/core-js/utils/io/logger');
const { subtask } = require('hardhat/config');
const { SUBTASK_HANDLE_REGISTER } = require('../task-names');

subtask(SUBTASK_HANDLE_REGISTER, 'Register event').setAction(async () => {
  logger.subtitle('Handling Register - No Custom Logic');
});
