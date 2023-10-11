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

    const data = [
      [contract.address, contract.interface.encodeFunctionData('evaluate', [1000])],
      [contract.address, contract.interface.encodeFunctionData('resolve', [])],
      // [contract.address, contract.interface.encodeFunctionData('modifyEpochSchedule', [])]
    ];

    const filePath = path.join(__dirname, '../../../tx.csv');
    fs.appendFileSync(filePath, data.map((d) => d.join(',')).join('\n') + '\n');

    // const arrayStore = await hre.ethers.provider.getStorageAt(
    //   contract.address,
    //   BigInt('0x4a7bae7406c7467d50a80c6842d6ba8287c729469098e48fc594351749ba4b22') + BigInt(7)
    // );
    // const arrayLength = await hre.ethers.provider.getStorageAt(contract.address, arrayStore);
    //
    // console.log({ arrayStore, arrayLength, currentEpoch });
  }
);
