import { store, BigInt } from "@graphprotocol/graph-ts";
import {
  VoteRecorded,
  VoteWithdrawn
} from "../generated/CoreContributor/ElectionModule";
import { Vote, VoteResult } from "../generated/schema";
import { ElectionModule } from "../generated/Trader/ElectionModule";

export function handleVoteRecorded(event: VoteRecorded): void {
  let id = event.params.voter
    .toHexString()
    .concat("-")
    .concat(event.address.toHexString())
    .concat("-")
    .concat(event.params.epochIndex.toString());

  let voteRecord = new Vote(id);

  voteRecord.ballotId = event.params.ballotId;
  voteRecord.epochIndex = event.params.epochIndex.toString();
  voteRecord.voter = event.params.voter.toHexString();
  voteRecord.votePower = event.params.votePower;
  voteRecord.contract = event.address.toHexString();
  voteRecord.tx = event.transaction.hash;
  voteRecord.save();

  let resultId =
    event.address.toHexString() + "." + event.params.ballotId.toHexString();
  let result = VoteResult.load(resultId);
  if (result == null) {
    const module = ElectionModule.bind(event.address);
    result = new VoteResult(resultId);
    result.votePower = BigInt.fromString("0");
    result.voteCount = BigInt.fromString("0");
    result.epochIndex = event.params.epochIndex.toString();
    result.contract = event.address.toHexString();
    result.candidate = module.getBallotCandidates(event.params.ballotId)[0];
  }

  result.ballotId = event.params.ballotId;
  result.votePower = result.votePower.plus(event.params.votePower);
  result.voteCount = result.voteCount.plus(BigInt.fromI32(1));
  result.save();
}

export function handleVoteWithdrawn(event: VoteWithdrawn): void {
  let id = event.params.voter
    .toHexString()
    .concat("-")
    .concat(event.address.toHexString())
    .concat("-")
    .concat(event.params.epochIndex.toString());

  store.remove("Vote", id);

  let resultId =
    event.address.toHexString() + "." + event.params.ballotId.toHexString();
  let result = VoteResult.load(resultId);
  if (result !== null) {
    result.votePower = result.votePower.minus(event.params.votePower);
    result.voteCount = result.voteCount.minus(BigInt.fromI32(1));
    if (result.voteCount.equals(BigInt.zero())) {
      store.remove("VoteResult", resultId);
    } else {
      result.save();
    }
  }
}
