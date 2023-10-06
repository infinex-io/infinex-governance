//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Votes.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract CoreContributorToken is ERC721Votes, Ownable2Step {
    using EnumerableSet for EnumerableSet.AddressSet;

    error TokenIsNotTransferable();

    EnumerableSet.AddressSet private _members;

    constructor(address owner, address[] memory initialMembers)
    ERC721("Infinex CC", "INXCC")
    EIP712("INFINEX", "1") {
        for (uint i = 0; i < initialMembers.length; i++) {
            mint(initialMembers[i]);
        }

        _transferOwnership(owner);
    }

    function getMembers() external view returns (address[] memory) {
        return _members.values();
    }

    function getCouncilMembers() external view returns (address[] memory) {
        return _members.values();
    }

    function mint(address to) public virtual onlyOwner {
        if (delegates(to) == address(0)) {
            _delegate(to, to);
        }
        _mint(to, uint256(uint160(to)));
    }

    function burn(uint256 tokenId) public virtual onlyOwner {
        _burn(tokenId);
    }

    function _transfer(address, address, uint256) internal virtual override {
        revert TokenIsNotTransferable();
    }

    function _afterTokenTransfer(address from, address to, uint256, uint256) internal virtual override {
        if (to != address(0)) {
            _members.add(to);
        }
        if (from != address(0) && balanceOf(from) == 0) {
            _members.remove(from);
        }
    }
}
