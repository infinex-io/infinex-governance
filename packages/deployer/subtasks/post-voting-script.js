const logger = require('@synthetixio/core-js/utils/io/logger');
const { subtask } = require('hardhat/config');
const { SUBTASK_POST_VOTING_SCRIPT } = require('../task-names');

subtask(SUBTASK_POST_VOTING_SCRIPT, 'Subtask post voting handler to do some logic').setAction(
  async () => {
    logger.subtitle('POST_VOTING_SCRIPT - NO LOGIC');
  }
);
