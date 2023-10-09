const { task } = require('hardhat/config');
const { TASK_COMPILE } = require('hardhat/builtin-tasks/task-names');

const {
  SUBTASK_LOAD_DEPLOYMENT,
  SUBTASK_INITIALISE_OWNER,
  SUBTASK_INITIALISE_ELECTION,
  TASK_INITIALISE,
} = require('../task-names');

const logger = require('@synthetixio/core-js/utils/io/logger');
const prompter = require('@synthetixio/core-js/utils/io/prompter');
const types = require('@synthetixio/core-js/utils/hardhat/argument-types');
const { readPackageJson } = require('@synthetixio/core-js/utils/misc/npm');

task(TASK_INITIALISE, 'Initialises all of the election modules')
  .addFlag('noConfirm', 'Skip all confirmation prompts', false)
  .addFlag('debug', 'Display debug logs', false)
  .addFlag('quiet', 'Silence all output', false)
  .addOptionalParam('owner', 'The designated owner of the contract', process.env.ELECTION_OWNER)
  .addOptionalParam(
    'instance',
    'The name of the target instance for deployment',
    'official',
    types.alphanumeric
  )
  .setAction(async (taskArguments, hre) => {
    const { debug, quiet, noConfirm } = taskArguments;

    logger.quiet = quiet;
    logger.debugging = debug;
    prompter.noConfirm = noConfirm;

    // Do not throw an error on missing package.json
    // This is so we don't force the user to have the file on tests just for the name
    try {
      await logger.title(readPackageJson().name);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    const signer = await hre.ethers.getSigner();
    await logger.title('DEPLOYER');

    await hre.run(SUBTASK_LOAD_DEPLOYMENT, taskArguments);
    await _compile(hre, quiet);

    await hre.run(SUBTASK_INITIALISE_OWNER, { owner: signer.address });
    await hre.run(SUBTASK_INITIALISE_ELECTION, { owner: signer.address });
    await hre.run(SUBTASK_INITIALISE_OWNER, { owner: signer.address });
  });

/*
 * Note: Even though hardhat's compile task has a quiet option,
 * it still prints some output. This is a hack to completely silence
 * output during compile task run.
 */
async function _compile(hre, quiet) {
  let logCache;

  if (quiet) {
    logCache = console.log;
    console.log = () => {};
  }

  try {
    await hre.run(TASK_COMPILE, { force: true, quiet: true });
  } finally {
    if (logCache) console.log = logCache;
  }
}
