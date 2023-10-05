//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC721HistoricalBalanceStorage {
    struct Checkpoint {
        uint32 fromBlock;
        uint256 balance;
    }

    struct ERC721HistoricalBalanceStore {
        Checkpoint[] totalSupplyCheckpoints;
        mapping(address => Checkpoint[]) checkpoints;
    }

    function _erc721HistoricalBalanceStore() internal pure returns (ERC721HistoricalBalanceStore storage store) {
        assembly {
            // bytes32(uint(keccak256("io.synthetix.ERC721HistoricalBalance")) - 1)
            store.slot := 0xb1ebc47bdd8b795fa8ffd3282a1e19a422b59ed958723faee606b5b55c9aeef6
        }
    }
}
