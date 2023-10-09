const logger = require('@synthetixio/core-js/utils/io/logger');
const { subtask } = require('hardhat/config');
const { SUBTASK_INITIALISE_EXTRA } = require('../task-names');

subtask(SUBTASK_INITIALISE_EXTRA, 'Initialises extra custom logic').setAction(async (_, hre) => {
  logger.subtitle('Initialising Extra Custom Logic');
});
