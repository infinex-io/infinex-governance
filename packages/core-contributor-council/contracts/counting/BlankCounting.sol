//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@synthetixio/synthetix-governance/contracts/interfaces/IDebtShare.sol";

contract BlankCounting is IDebtShare {

    function balanceOfOnPeriod(address, uint) external override pure returns (uint) {
        return 0;
    }

}
