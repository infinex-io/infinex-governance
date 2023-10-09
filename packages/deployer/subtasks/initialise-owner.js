const logger = require('@synthetixio/core-js/utils/io/logger');
const prompter = require('@synthetixio/core-js/utils/io/prompter');
const { subtask } = require('hardhat/config');
const { SUBTASK_INITIALISE_OWNER } = require('../task-names');

subtask(SUBTASK_INITIALISE_OWNER, 'Initialises the owner of the election module').setAction(
  async ({ owner }, hre) => {
    logger.subtitle('Initialising Owner');

    if (!owner) {
      throw new Error('Missing owner to claim ownership');
    }

    const contracts = Object.values(hre.deployer.deployment.general.contracts);
    const proxyData = contracts.find((data) => data.isProxy);
    const proxyAddress = proxyData.deployedAddress;

    const ownerFactory = await hre.ethers.getContractFactory(
      'contracts/modules/OwnerModule.sol:OwnerModule'
    );

    const contract = ownerFactory.attach(proxyAddress);

    const currentOwner = await contract.owner();

    let tx;
    if (BigInt(currentOwner) === BigInt(0)) {
      await prompter.confirmAction('Initialise Owner ' + owner);

      tx = await contract.initializeOwnerModule(owner);

      logger.info('claiming ownership', tx.hash);

      await tx.wait();
    } else if (BigInt(currentOwner) !== BigInt(owner)) {
      await prompter.confirmAction('Nominate Owner ' + owner);

      const signer = hre.ethers.getSigner(owner);

      tx = await contract.connect(signer).nominateOwner(owner);

      logger.info('nominating new owner', tx.hash);

      await tx.wait();
    } else {
      logger.info('No owner changes');
    }
  }
);
