//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@synthetixio/synthetix-governance/contracts/interfaces/IDebtShare.sol";

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

contract InvestorToken is ERC721Votes, Ownable2Step, IDebtShare {

    constructor(address[] memory initialInvestors)
    ERC721("Infinex Benefactor", "INXBF")
    EIP712("INFINEX", "1") {
        for (uint i = 0; i < initialInvestors.length; i++) {
            mint(initialInvestors[i]);
        }
    }

    function balanceOfOnPeriod(address account, uint timepoint) external override view returns (uint) {
        return getPastVotes(account, timepoint);
    }

    function mint(address to) public virtual onlyOwner {
        if (delegates(to) == address(0)) {
            _delegate(to, to);
        }
        _mint(to, _getTotalSupply());
    }

    function burn(uint256 tokenId) public virtual onlyOwner {
        _burn(tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal virtual override {
        if (delegates(to) == address(0)) {
            _delegate(to, to);
        }
        super._transfer(from, to, tokenId);
    }
}
