const { ethers } = require('hardhat');

async function main() {
  const electionModuleFactory = await ethers.getContractFactory(
    'contracts/modules/ElectionModule.sol:ElectionModule'
  );

  const CONTRACT_ADDRESS = '0xaC29b8c5413044F74Ff80679279987acc4E0559d';

  const electionModule = electionModuleFactory.attach(CONTRACT_ADDRESS);
  let tx;

  if ((await electionModule.getCurrentPeriod()).eq(1)) {
    let debtShareSnapshotId;
    try {
      debtShareSnapshotId = BigInt(await electionModule.getDebtShareSnapshotId());
    } catch (e) {
      debtShareSnapshotId = BigInt(0);
    }

    if (debtShareSnapshotId === BigInt(0)) {
      tx = await electionModule.setDebtShareSnapshotId(await ethers.provider.getBlockNumber());
      console.log('set snapshot id ' + tx.hash);
      await tx.wait();
      console.log('done');
    } else {
      console.log('snapshot already staken');
    }
  } else {
    console.log('invalid time period');
  }
}

main().catch((e) => console.error(e));
