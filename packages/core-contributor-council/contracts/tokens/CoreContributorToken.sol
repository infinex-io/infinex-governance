//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@synthetixio/core-contracts/contracts/proxy/UUPSImplementation.sol";
import "@synthetixio/core-contracts/contracts/ownership/Ownable.sol";
import "@synthetixio/core-contracts/contracts/token/ERC721HistoricalBalance.sol";

contract CoreContributorToken is Ownable, UUPSImplementation, ERC721HistoricalBalance {
    error TokenIsNotTransferable();

    function initialize(string memory tokenName, string memory tokenSymbol, address[] calldata members) public onlyOwner {
        _initialize(tokenName, tokenSymbol, "");

        for (uint i = 0; i < members.length; i++) {
            mint(members[i]);
        }
    }

    function upgradeTo(address newImplementation) public override onlyOwner {
        _upgradeTo(newImplementation);
    }

    function mint(address to) public virtual onlyOwner {
        _mint(to, totalSupply);
    }

    function burn(uint256 tokenId) public virtual onlyOwner {
        _burn(tokenId);
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public virtual override {
        revert TokenIsNotTransferable();
    }

    function safeTransferFrom(
        address,
        address,
        uint256,
        bytes memory
    ) public virtual override {
        revert TokenIsNotTransferable();
    }
}
