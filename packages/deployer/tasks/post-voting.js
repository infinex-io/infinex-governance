const { task } = require('hardhat/config');
const { TASK_COMPILE } = require('hardhat/builtin-tasks/task-names');

const {
  SUBTASK_LOAD_DEPLOYMENT,
  TASK_POST_VOTING,
  SUBTASK_POST_VOTING_SCRIPT,
  SUBTASK_POST_RESOLVE,
  SUBTASK_POST_SYNC_SCHEDULE,
} = require('../task-names');

const logger = require('@synthetixio/core-js/utils/io/logger');
const prompter = require('@synthetixio/core-js/utils/io/prompter');
const { readPackageJson } = require('@synthetixio/core-js/utils/misc/npm');
const types = require('@synthetixio/core-js/utils/hardhat/argument-types');

task(TASK_POST_VOTING, 'Executes logic during the nomination event')
  .addFlag('noConfirm', 'Skip all confirmation prompts', false)
  .addFlag('debug', 'Display debug logs', false)
  .addFlag('quiet', 'Silence all output', false)

  .addOptionalParam(
    'nominationDays',
    'The nomination duration in days',
    process.env.NOMINATION_DAYS
  )
  .addOptionalParam('votingDays', 'The voting duration in days', process.env.VOTING_DAYS)
  .addOptionalParam('epochDays', 'The epoch duration in days', process.env.EPOCH_DAYS)
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

    await logger.title('POST_VOTING');

    await hre.run(SUBTASK_LOAD_DEPLOYMENT, taskArguments);
    await _compile(hre, quiet);
    await hre.run(SUBTASK_POST_RESOLVE);
    await hre.run(SUBTASK_POST_SYNC_SCHEDULE, taskArguments);
    await hre.run(SUBTASK_POST_VOTING_SCRIPT);
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
