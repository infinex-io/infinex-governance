//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../storage/GlobalStorage.sol";
import "../interfaces/ISomeModuleModified.sol";

contract SomeModule is GlobalStorage, ISomeModuleModified {
    event ValueSet(address sender, uint value);

    function setValue(uint newValue) public override {
        _globalStore().value = newValue;

        emit ValueSet(msg.sender, newValue);
    }

    function setSomeValue(uint newSomeValue) public override {
        _globalStore().someValue = newSomeValue;

        emit ValueSet(msg.sender, newSomeValue);
    }

    function getValue() public view override returns (uint) {
        return _globalStore().value;
    }

    function getSomeValue() public view override returns (uint) {
        return _globalStore().someValue;
    }

    function fourtyTwo() public pure override returns (uint) {
        return 42;
    }
}
