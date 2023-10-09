const { subtask } = require('hardhat/config');
const { SUBTASK_GET_DEBT_SHARE_CONTRACT } = require('../task-names');
subtask(SUBTASK_GET_DEBT_SHARE_CONTRACT, 'Gets the debt share contract address').setAction(
  async ({ name = 'blankCounting' }, hre) => {
    const deployments = require('@infinex/core-tokens/deployment.' + hre.network.name + '.json');
    return deployments[name].address;
  }
);
