import { store, BigInt } from "@graphprotocol/graph-ts";
import {
  VoteRecorded,
  VoteWithdrawn,
} from "../generated/Ecosystem/ElectionModule";
import { Vote, VoteResult } from "../generated/schema";
import { ElectionModule } from "../generated/Trader/ElectionModule";

function getVoteId(
  voter: string,
  contract: string,
  epochIndex: string
): string {
  return voter.concat("-").concat(contract).concat("-").concat(epochIndex);
}

function getVoteResultId(
  contract: string,
  ballotId: string,
  epochIndex: string
): string {
  return contract.concat("-").concat(ballotId).concat("-").concat(epochIndex);
}

export function handleVoteRecorded(event: VoteRecorded): void {
  // vote
  const voteId = getVoteId(
    event.params.voter.toHexString(),
    event.address.toHexString(),
    event.params.epochIndex.toString()
  );

  // Will always be new, if there is a re-vote, the withdrawn event will be triggered first.
  const vote = new Vote(voteId);
  vote.ballotId = event.params.ballotId;
  vote.epochIndex = event.params.epochIndex.toString();
  vote.voter = event.params.voter.toHexString();
  vote.votePower = event.params.votePower;
  vote.contract = event.address.toHexString();
  vote.tx = event.transaction.hash;
  vote.save();

  // voteResult
  const voteResultId = getVoteResultId(
    event.address.toHexString(),
    event.params.ballotId.toHexString(),
    event.params.epochIndex.toString()
  );
  let result = VoteResult.load(voteResultId);
  if (result == null) {
    const module = ElectionModule.bind(event.address);
    result = new VoteResult(voteResultId);
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
  // Vote
  let id = getVoteId(
    event.params.voter.toHexString(),
    event.address.toHexString(),
    event.params.epochIndex.toString()
  );
  store.remove("Vote", id);

  // VoteResult
  let resultId = getVoteResultId(
    event.address.toHexString(),
    event.params.ballotId.toHexString(),
    event.params.epochIndex.toString()
  );

  let voteResult = VoteResult.load(resultId);
  if (voteResult !== null) {
    voteResult.votePower = voteResult.votePower.minus(event.params.votePower);
    voteResult.voteCount = voteResult.voteCount.minus(BigInt.fromI32(1));
    if (voteResult.voteCount.equals(BigInt.zero())) {
      store.remove("VoteResult", resultId);
    } else {
      voteResult.save();
    }
  }
}
