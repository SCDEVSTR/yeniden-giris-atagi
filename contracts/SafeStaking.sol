// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SafeStaking is ReentrancyGuard {
    // balances mapping
    mapping(address => uint) public balances;

    // update balances mapping to include deposited amount
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // send user's fund if user has enough balance
    // nonReentrant modifier added from ReentrancyGuard.sol of OpenZeppelin
    function withdraw(uint amount) public nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount; // updating balances mapping AFTER sending ETH is vulnerable!
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to withdraw");
    }
}
