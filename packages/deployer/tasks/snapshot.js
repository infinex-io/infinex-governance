const { task } = require('hardhat/config');
const { TASK_COMPILE } = require('hardhat/builtin-tasks/task-names');

const { SUBTASK_LOAD_DEPLOYMENT, TASK_SNAPSHOT, SUBTASK_TAKE_SNAPSHOT } = require('../task-names');

const logger = require('@synthetixio/core-js/utils/io/logger');
const prompter = require('@synthetixio/core-js/utils/io/prompter');
const types = require('@synthetixio/core-js/utils/hardhat/argument-types');
const { readPackageJson } = require('@synthetixio/core-js/utils/misc/npm');

task(TASK_SNAPSHOT, 'Takes a snapshot of the deployment')
  .addFlag('noConfirm', 'Skip all confirmation prompts', false)
  .addFlag('debug', 'Display debug logs', false)
  .addFlag('quiet', 'Silence all output', false)
  .addOptionalParam('alias', 'The alias name for the deployment', undefined, types.alphanumeric)
  .addOptionalPositionalParam(
    'modules',
    'Regex string for which modules are deployed to the router. Leave empty to deploy all modules.'
  )
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

    await logger.title('SNAPSHOT');

    await hre.run(SUBTASK_LOAD_DEPLOYMENT, taskArguments);
    await _compile(hre, quiet);
    await hre.run(SUBTASK_TAKE_SNAPSHOT, taskArguments);
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
