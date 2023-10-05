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

  const OWNER = '';
  const CONTRACT_ADDRESS = '0xCCF664ed84DcDedcC4783707993C12b5019D6693';
  const DEBT_SHARE_CONTRACT = '0xD2bB10738eC91390D77eeb1010AA1c466fC905Ee';
  const SNAPSHOT_DATE = '2023-10-05T07:59:00Z';
  const NOMINATION_START_DATE = '2023-10-05T08:00:00Z';
  const NOMINATION_DURATION = hoursToSeconds(2.5);
  const VOTING_DURATION = hoursToSeconds(4);
  const MAX_UINT64 = BigInt(2) ** BigInt(64) - BigInt(1);

  const schedule = {
    snapshotId: isoToSeconds(SNAPSHOT_DATE),
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
      'Infinex Ecosystem Councillor',
      'INXEC',
      ['0x000000000000000000000000000000000000dead', '0x000000000000000000000000000000000000deed'],
      2,
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
    //   'Infinex Trader Councillor',
    //   'INXTTC',
    //   ['0x000000000000000000000000000000000000dead'],
    //   1,
    //   isoToSeconds(NOMINATION_START_DATE),
    //   NOMINATION_DURATION + isoToSeconds(NOMINATION_START_DATE),
    //   VOTING_DURATION + NOMINATION_DURATION + isoToSeconds(NOMINATION_START_DATE),
    //   DEBT_SHARE_CONTRACT
    // );
  }

  if (OWNER && BigInt(await ownerModule.owner()) !== BigInt(OWNER)) {
    tx = await ownerModule.nominateOwner(OWNER);
    console.log('nominate owner', tx.hash);
    await tx.wait();
  }

  let debtShareSnapshotId;
  try {
    debtShareSnapshotId = BigInt(await electionModule.getDebtShareSnapshotId());
  } catch (e) {
    debtShareSnapshotId = BigInt(0);
  }

  if (
    debtShareSnapshotId !== BigInt(schedule.snapshotId) &&
    schedule.nominationStartDate * 1000 <= Date.now()
  ) {
    tx = await electionModule.setDebtShareSnapshotId(schedule.snapshotId);
    console.log('set snapshot id', tx.hash);
    await tx.wait();
  }

  console.log('done');
}

main().catch((e) => console.error(e));
