// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract VulnerableStaking {
    // balances mapping
    mapping(address => uint) public balances;

    // update balances mapping to include deposited amount
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // send user's fund if user has balance
    function withdraw() public {
        require(balances[msg.sender] > 0, "Insufficient balance");
        (bool sent, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(sent, "Failed to withdraw");
        balances[msg.sender] = 0; // updating balances mapping AFTER sending ETH is vulnerable!
    }
}
