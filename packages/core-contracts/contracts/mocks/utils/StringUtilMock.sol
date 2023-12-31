//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../../utils/StringUtil.sol";

contract StringUtilMock {
    function uintToString(uint value) public pure returns (string memory) {
        return StringUtil.uintToString(value);
    }
}
