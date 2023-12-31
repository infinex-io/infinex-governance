const fs = require('fs');
const path = require('path');
const { TASK_DEPLOY } = require('@synthetixio/deployer/task-names');
const { resetHardhatContext } = require('hardhat/plugins-testing');

function loadEnvironment(fixtureProjectName, networkName = 'hardhat') {
  resetHardhatContext();

  let envPath = fixtureProjectName;
  if (fixtureProjectName.includes('/')) {
    envPath = fixtureProjectName;
  } else {
    envPath = _getEnvironmentPath(fixtureProjectName);
  }

  process.chdir(envPath);
  process.env.HARDHAT_NETWORK = networkName;

  return require('hardhat');
}

async function deployOnEnvironment(hre, customOptions = {}) {
  const deploymentInfo = {
    network: hre.config.defaultNetwork,
    instance: 'test',
  };

  await hre.run(TASK_DEPLOY, {
    ...deploymentInfo,
    noConfirm: true,
    quiet: true,
    ...customOptions,
  });

  if (customOptions.clear) {
    let initializer;

    try {
      initializer = require(path.join(hre.config.paths.root, 'test', 'helpers', 'initializer'));
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
      }
    }

    if (initializer) {
      await initializer(deploymentInfo, hre);
    }
  }
}

function _getEnvironmentPath(fixtureProjectName) {
  const pathname = path.resolve(__dirname, '..', 'fixture-projects', fixtureProjectName);

  if (!fs.existsSync(pathname)) {
    throw new Error(`Invalid fixture project ${fixtureProjectName}`);
  }

  return pathname;
}

module.exports = {
  loadEnvironment,
  deployOnEnvironment,
};
