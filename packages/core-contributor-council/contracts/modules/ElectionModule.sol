//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ElectionModule as SynthetixElectionModule} from "@synthetixio/synthetix-governance/contracts/modules/ElectionModule.sol";
import "@synthetixio/core-contracts/contracts/interfaces/IERC721.sol";
import "../interfaces/IElectionCoreContributor.sol";
import "../storage/CoreContributorStorage.sol";

// solhint-disable-next-line no-empty-blocks
contract ElectionModule is SynthetixElectionModule, IElectionCoreContributor, CoreContributorStorage {
    event CoreContributorTokenUpdated(address indexed newToken);

    error OnlyCoreContributor();
    error MissingCoreContributorToken();

    function setCoreContributorToken(address token) public virtual override onlyOwner {
        _ccStore().token = token;
        emit CoreContributorTokenUpdated(token);
    }

    function getCoreContributorToken() public virtual view override returns (address) {
        return _ccStore().token;
    }

    function nominate() public virtual override {
        address token = getCoreContributorToken();
        if (token == address(0)) {
            revert MissingCoreContributorToken();
        }

        if (IERC721(token).balanceOf(msg.sender) == 0) {
            revert OnlyCoreContributor();
        }

        super.nominate();
    }
}
