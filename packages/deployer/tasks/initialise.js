const { task } = require('hardhat/config');
const { TASK_COMPILE } = require('hardhat/builtin-tasks/task-names');

const {
  SUBTASK_LOAD_DEPLOYMENT,
  SUBTASK_INITIALISE_OWNER,
  SUBTASK_INITIALISE_ELECTION,
  TASK_INITIALISE,
  SUBTASK_GET_DEBT_SHARE_CONTRACT,
  SUBTASK_INITIALISE_EXTRA,
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
    'debtShareContractName',
    'The name of the debt share contract',
    process.env.DEBT_SHARE_CONTRACT || 'blankCounting'
  )
  .addOptionalParam('nftName', 'The name of the NFT contract', process.env.NFT_NAME)
  .addOptionalParam(
    'totalMembers',
    'How many members will be in the council',
    process.env.TOTAL_MEMBERS
  )
  .addOptionalParam('nftSymbol', 'The name of the NFT contract', process.env.NFT_SYMBOL)
  .addOptionalParam(
    'nominationStartDate',
    'The when the nominations begin',
    process.env.NOMINATION_START_DATE
  )
  .addOptionalParam(
    'nominationDays',
    'The nomination duration in days',
    process.env.NOMINATION_DAYS
  )
  .addOptionalParam('votingDays', 'The voting duration in days', process.env.VOTING_DAYS)
  .addOptionalParam(
    'instance',
    'The name of the target instance for deployment',
    'official',
    types.alphanumeric
  )
  .setAction(async (taskArguments, hre) => {
    const {
      debug,
      quiet,
      noConfirm,
      owner,
      nftName,
      nftSymbol,
      nominationStartDate,
      nominationDays,
      votingDays,
      totalMembers,
      debtShareContractName,
    } = taskArguments;

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
    await logger.title('INITIALISE');

    await hre.run(SUBTASK_LOAD_DEPLOYMENT, taskArguments);
    await _compile(hre, quiet);

    const DEBT_CONTRACT = await hre.run(SUBTASK_GET_DEBT_SHARE_CONTRACT, {
      name: debtShareContractName,
    });

    await hre.run(SUBTASK_INITIALISE_OWNER, { owner: signer.address });
    await hre.run(SUBTASK_INITIALISE_ELECTION, {
      nftName,
      nftSymbol,
      nominationStartDate,
      nominationDays,
      votingDays,
      totalMembers,
      debtShareContract: DEBT_CONTRACT,
    });
    await hre.run(SUBTASK_INITIALISE_EXTRA);
    await hre.run(SUBTASK_INITIALISE_OWNER, { owner });
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
