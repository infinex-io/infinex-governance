//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IElectionNominate {

    /// @notice Allows anyone to self-nominate during the Nomination period
    function nominate() external;
}
