//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CoreContributorStorage {
    struct CoreContributorStore {
        // the core contributor token
        address token;
    }

    function _ccStore() internal pure returns (CoreContributorStore storage store) {
        assembly {
            // bytes32(uint(keccak256("io.synthetix.cc")) - 1)
            store.slot := 0x11fdf78a2f72dedf44c0a687d4ad31ec5575be13bfc7481ef38716c228323151
        }
    }
}
