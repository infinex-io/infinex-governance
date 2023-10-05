//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@synthetixio/synthetix-governance/contracts/interfaces/IDebtShare.sol";

import "../tokens/InvestorToken.sol";

contract InvestorCounting is IDebtShare {

    InvestorToken immutable public token;

    constructor(InvestorToken _token) {
        token = _token;
    }

    function balanceOfOnPeriod(address account, uint periodId) external override view returns (uint) {
        return token.balanceOfAt(account, periodId);
    }

}
