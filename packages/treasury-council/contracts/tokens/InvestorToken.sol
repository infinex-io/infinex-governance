//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@synthetixio/core-contracts/contracts/proxy/UUPSImplementation.sol";
import "@synthetixio/core-contracts/contracts/ownership/Ownable.sol";
import "@synthetixio/core-contracts/contracts/token/ERC721HistoricalBalance.sol";

contract InvestorToken is Ownable, UUPSImplementation, ERC721HistoricalBalance {
    error TokenIsNotTransferable();

    function initialize(string memory tokenName, string memory tokenSymbol) public onlyOwner {
        _initialize(tokenName, tokenSymbol, "");
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
}
