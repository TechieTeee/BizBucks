// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BizBucks is ERC20 {
    uint public unlockTime;
    address payable public owner;

    constructor(uint _initialSupply, uint _unlockTime) ERC20("BizBucks", "BB") payable {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");

        _mint(msg.sender, _initialSupply);
        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        uint balance = balanceOf(address(this));
        emit Transfer(address(this), owner, balance);
        _transfer(address(this), owner, balance);
    }
}
