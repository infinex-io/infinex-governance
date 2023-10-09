const config = require('@synthetixio/common-config/hardhat.config.js');
const { requireAll } = require('@synthetixio/core-js/utils/misc/require-all');

requireAll(`${__dirname}/subtasks`);

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  ...config,
  solidity: {
    compilers: [config.solidity],
    overrides: {
      'contracts/modules/ElectionModule.sol': {
        version: '0.8.11',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
      '@synthetixio/synthetix-governance/contracts/modules/ElectionModule.sol': {
        version: '0.8.11',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
    },
  },
  deployer: {
    proxyContract: 'EcosystemCouncil',
  },
};
