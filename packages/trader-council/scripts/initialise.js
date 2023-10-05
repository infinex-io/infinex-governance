const { ethers } = require('hardhat');
const { daysToSeconds } = require('@synthetixio/core-js/utils/misc/dates');

const hoursToSeconds = (number) => number * 60 * 60;
const isoToSeconds = (time) => Math.round(new Date(time).getTime() / 1000);
async function main() {
  const signer = await ethers.getSigner();

  const electionModuleFactory = await ethers.getContractFactory(
    'contracts/modules/ElectionModule.sol:ElectionModule'
  );
  const ownerFactory = await ethers.getContractFactory(
    'contracts/modules/OwnerModule.sol:OwnerModule'
  );

  const CONTRACT_ADDRESS = '0xA25E083fAC779BD8bF92D4C7a496381794eB1772';
  const DEBT_SHARE_CONTRACT = '0x34c78F826bA5750Ad17C77aAF7737359eA67cFd6';
  const NOMINATION_START_DATE = '2023-10-05T08:00:00Z';
  const NOMINATION_DURATION = hoursToSeconds(2.5);
  const VOTING_DURATION = hoursToSeconds(4);
  const MAX_UINT64 = BigInt(2) ** BigInt(64) - BigInt(1);

  const schedule = {
    nominationStartDate: isoToSeconds(NOMINATION_START_DATE),
    votingStartDate: NOMINATION_DURATION + isoToSeconds(NOMINATION_START_DATE),
    epochEndDate: VOTING_DURATION + NOMINATION_DURATION + isoToSeconds(NOMINATION_START_DATE),
  };

  const electionModule = electionModuleFactory.attach(CONTRACT_ADDRESS);
  const ownerModule = ownerFactory.attach(CONTRACT_ADDRESS);

  let tx;
  if (BigInt(await ownerModule.owner()) !== BigInt(signer.address)) {
    tx = await ownerModule.initializeOwnerModule(signer.address);
    console.log('claiming ownership', tx.hash);
    await tx.wait();
  }

  if (BigInt(await electionModule.getCouncilToken()) === BigInt(0)) {
    // TODO dont do the test network version

    tx = await electionModule[
      'initializeElectionModule(string,string,address[],uint8,uint64,uint64,uint64,address)'
    ](
      'Infinex Trader Councillor NFT',
      'INXTTC',
      ['0x000000000000000000000000000000000000dead'],
      1,
      isoToSeconds(NOMINATION_START_DATE),
      daysToSeconds(3) + isoToSeconds(NOMINATION_START_DATE),
      daysToSeconds(8) + isoToSeconds(NOMINATION_START_DATE),
      DEBT_SHARE_CONTRACT
    );
    console.log('initialised contract', tx.hash);
    await tx.wait();

    // TODO delete this
    tx = await electionModule.setMinEpochDurations(1, 1, 1);
    console.log('set min epoch durations', tx.hash);
    await tx.wait();

    // TODO delete this
    tx = await electionModule.setMaxDateAdjustmentTolerance(MAX_UINT64);
    console.log('set max date', tx.hash);
    await tx.wait();

    tx = await electionModule.tweakEpochSchedule(
      schedule.nominationStartDate,
      schedule.votingStartDate,
      schedule.epochEndDate
    );
    console.log('tweak start dates', tx.hash);
    await tx.wait();

    // TODO dont do the test network version

    // tx = await electionModule.initializeElectionModule(
    //   'Infinex Trader Councillor NFT',
    //   'INXTTC',
    //   ['0x000000000000000000000000000000000000dead'],
    //   1,
    //   isoToSeconds(NOMINATION_START_DATE),
    //   NOMINATION_DURATION + isoToSeconds(NOMINATION_START_DATE),
    //   VOTING_DURATION + NOMINATION_DURATION + isoToSeconds(NOMINATION_START_DATE),
    //   DEBT_SHARE_CONTRACT
    // );
  }

  console.log('done');
}

main().catch((e) => console.error(e));
