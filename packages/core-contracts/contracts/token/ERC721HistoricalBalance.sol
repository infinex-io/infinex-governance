//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../interfaces/IERC721HistoricalBalance.sol";
import "./ERC721HistoricalBalanceStorage.sol";
import "./ERC721.sol";

/*
    Reference implementations:
    * OpenZeppelin - https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC20Votes.sol
*/

contract ERC721HistoricalBalance is ERC721, IERC721HistoricalBalance, ERC721HistoricalBalanceStorage {
    error InvalidUint32Number(uint blockNumber);
    error BlockNumberNotYetMined(uint blockNumber);

    uint256 public totalSupply;

    function totalSupplyAt(uint blockNumber) external view override returns (uint) {
        if (blockNumber >= block.number) {
            revert BlockNumberNotYetMined(blockNumber);
        }

        return _checkpointsLookup(_erc721HistoricalBalanceStore().totalSupplyCheckpoints, blockNumber);
    }

    function balanceOfAt(address owner, uint blockNumber) public view override returns (uint) {
        if (blockNumber >= block.number) {
            revert BlockNumberNotYetMined(blockNumber);
        }

        return _checkpointsLookup(_erc721HistoricalBalanceStore().checkpoints[owner], blockNumber);
    }

    function _checkpointsLookup(Checkpoint[] storage ckpts, uint256 blockNumber) private view returns (uint256) {
        // We run a binary search to look for the earliest checkpoint taken after `blockNumber`.
        //
        // During the loop, the index of the wanted checkpoint remains in the range [low-1, high).
        // With each iteration, either `low` or `high` is moved towards the middle of the range to maintain the invariant.
        // - If the middle checkpoint is after `blockNumber`, we look in [low, mid)
        // - If the middle checkpoint is before or equal to `blockNumber`, we look in [mid+1, high)
        // Once we reach a single value (when low == high), we've found the right checkpoint at the index high-1, if not
        // out of bounds (in which case we're looking too far in the past and the result is 0).
        // Note that if the latest checkpoint available is exactly for `blockNumber`, we end up with an index that is
        // past the end of the array, so we technically don't find a checkpoint after `blockNumber`, but it works out
        // the same.
        uint256 high = ckpts.length;
        uint256 low = 0;
        while (low < high) {
            uint256 mid = _average(low, high);
            if (ckpts[mid].fromBlock > blockNumber) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }

        return high == 0 ? 0 : ckpts[high - 1].balance;
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        super._transfer(from, to, tokenId);

        _moveBalance(from, to, 1);
    }

    function _mint(address to, uint256 tokenId) internal override {
        super._mint(to, tokenId);

        // track the total supply
        totalSupply++;

        _moveBalance(address(0), to, 1);
        _writeCheckpoint(_erc721HistoricalBalanceStore().totalSupplyCheckpoints, _add, 1);
    }

    function _burn(uint256 tokenId) internal override {
        address from = ownerOf(tokenId);
        super._burn(tokenId);

        totalSupply--;

        _moveBalance(from, address(0), 1);
        _writeCheckpoint(_erc721HistoricalBalanceStore().totalSupplyCheckpoints, _subtract, 1);
    }

    function _moveBalance(
        address src,
        address dst,
        uint256 amount
    ) private {
        if (src != dst && amount > 0) {
            if (src != address(0)) {
                _writeCheckpoint(_erc721HistoricalBalanceStore().checkpoints[src], _subtract, amount);
            }

            if (dst != address(0)) {
                _writeCheckpoint(_erc721HistoricalBalanceStore().checkpoints[dst], _add, amount);
            }
        }
    }

    function _writeCheckpoint(
        Checkpoint[] storage ckpts,
        function(uint256, uint256) view returns (uint256) op,
        uint256 delta
    ) private {
        uint256 pos = ckpts.length;
        uint256 oldWeight = pos == 0 ? 0 : ckpts[pos - 1].balance;
        uint256 newWeight = op(oldWeight, delta);

        if (pos > 0 && ckpts[pos - 1].fromBlock == block.number) {
            ckpts[pos - 1].balance = newWeight;
        } else {
            ckpts.push(Checkpoint({fromBlock: _safeCastToUint32(block.number), balance: newWeight}));
        }
    }

    function _add(uint256 a, uint256 b) private pure returns (uint256) {
        return a + b;
    }

    function _subtract(uint256 a, uint256 b) private pure returns (uint256) {
        return a - b;
    }

    function _average(uint256 a, uint256 b) internal pure returns (uint256) {
        // (a + b) / 2 can overflow.
        return (a & b) + (a ^ b) / 2;
    }

    function _safeCastToUint32(uint256 number) internal view returns (uint32) {
        if (block.number > type(uint32).max) {
            revert InvalidUint32Number(block.number);
        }

        return uint32(number);
    }
}
