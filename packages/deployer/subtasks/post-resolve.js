const logger = require('@synthetixio/core-js/utils/io/logger');
const { subtask } = require('hardhat/config');
const { SUBTASK_POST_RESOLVE } = require('../task-names');
const path = require('path');
const fs = require('fs');

subtask(SUBTASK_POST_RESOLVE, 'Subtask post voting handler to do some logic').setAction(
  async (_, hre) => {
    logger.subtitle('POST_RESOLVE');

    const contracts = Object.values(hre.deployer.deployment.general.contracts);
    const proxyData = contracts.find((data) => data.isProxy);
    const proxyAddress = proxyData.deployedAddress;

    const electionFactory = await hre.ethers.getContractFactory(
      'contracts/modules/ElectionModule.sol:ElectionModule'
    );

    const contract = electionFactory.attach(proxyAddress);

    const totalBallots = await contract.getTotalBallots();

    const evaluates = Array.from(Array(totalBallots.div(1000).toNumber() + 1)).map(() => {
      return [contract.address, contract.interface.encodeFunctionData('evaluate', [1000])];
    });

    const data = [
      ...evaluates,
      [contract.address, contract.interface.encodeFunctionData('resolve', [])],
    ];

    const filePath = path.join(__dirname, '../../../tx.csv');
    fs.appendFileSync(filePath, data.map((d) => d.join(',')).join('\n') + '\n');
  }
);
