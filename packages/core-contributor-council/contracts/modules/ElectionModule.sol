//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ElectionModule as SynthetixElectionModule, IERC721} from "@synthetixio/synthetix-governance/contracts/modules/ElectionModule.sol";

// solhint-disable-next-line no-empty-blocks
contract ElectionModule is SynthetixElectionModule {
    error OnlyCoreContributor();

    IERC721 public immutable ccToken;

    constructor(IERC721 _ccToken) {
        ccToken = _ccToken;
    }

    function nominate() public virtual override {
        if (ccToken.balanceOf(msg.sender) == 0) {
            revert OnlyCoreContributor();
        }

        super.nominate();
    }
}
