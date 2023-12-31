require('@nomiclabs/hardhat-ethers');
require('../../..');

module.exports = {
  solidity: {
    version: '0.8.11',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  deployer: {
    proxyContract: 'CustomProxy',
  },
};
