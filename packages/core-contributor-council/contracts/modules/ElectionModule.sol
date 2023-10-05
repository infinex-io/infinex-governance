//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ElectionModule as SynthetixElectionModule, IElectionModule} from "@synthetixio/synthetix-governance/contracts/modules/ElectionModule.sol";
import "@synthetixio/core-contracts/contracts/interfaces/IERC721.sol";
import "../interfaces/IElectionModule.sol";

// solhint-disable-next-line no-empty-blocks
contract ElectionModule is SynthetixElectionModule, IElectionNominate {
    error OnlyCoreContributor();

    IERC721 public immutable ccToken;

    constructor(IERC721 _ccToken) {
        ccToken = _ccToken;
    }

    function nominate() public virtual override(IElectionNominate, IElectionModule) {
        if (ccToken.balanceOf(msg.sender) == 0) {
            revert OnlyCoreContributor();
        }

        super.nominate();
    }
}
