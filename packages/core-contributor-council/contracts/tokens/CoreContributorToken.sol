//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";

contract CoreContributorToken is ERC721Votes, Ownable2Step {
    error TokenIsNotTransferable();

    constructor(address owner, address[] calldata initialMembers) ERC721("Infinex CC", "INXCC") {
        for (uint i = 0; i < members.length; i++) {
            mint(members[i]);
        }

        _transferOwnership(owner);
    }

    function mint(address to) public virtual onlyOwner {
        _mint(to, _getTotalSupply());
    }

    function burn(uint256 tokenId) public virtual onlyOwner {
        _burn(tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal virtual override {
        revert TokenIsNotTransferable();
    }
}
