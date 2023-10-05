//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IElectionCoreContributor {
    function setCoreContributorToken(address token) external;
    function getCoreContributorToken() external view returns (address);
}
