//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@synthetixio/synthetix-governance/contracts/interfaces/IDebtShare.sol";

import "./InvestorToken.sol";

contract InvestorCounting is IDebtShare {

    InvestorToken immutable public token;

    constructor(InvestorToken _token) {
        token = _token;
    }

    function balanceOfOnPeriod(address account, uint timepoint) external override view returns (uint) {
        return token.getPastVotes(account, timepoint);
    }

}
