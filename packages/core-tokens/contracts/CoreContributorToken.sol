//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

contract CoreContributorToken is ERC721Votes, Ownable2Step {
    error TokenIsNotTransferable();

    constructor(address owner, address[] memory initialMembers)
    ERC721("Infinex CC", "INXCC")
    EIP712("INFINEX", "1") {
        for (uint i = 0; i < initialMembers.length; i++) {
            mint(initialMembers[i]);
        }

        _transferOwnership(owner);
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

    function _transfer(address, address, uint256) internal virtual override {
        revert TokenIsNotTransferable();
    }
}
