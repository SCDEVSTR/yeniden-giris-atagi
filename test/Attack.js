const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { parseEther, formatEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("Re-entrancy Attack", function () {
  let SafeStaking, VulnerableStaking, Attack;
  let safeStaking, vulnerableStaking, attack;
  let owner, user1, user2, attacker;

  before(async function () {
    [owner, user1, user2, attacker] = await ethers.getSigners();

    // deploy safe staking contract
    SafeStaking = await ethers.getContractFactory("SafeStaking");
    safeStaking = await SafeStaking.deploy();
    await safeStaking.deployed();
    // console.log(`SafeStaking Contract Address: ${safeStaking.address}`);

    // deploy vulnerable staking contract
    VulnerableStaking = await ethers.getContractFactory("VulnerableStaking");
    vulnerableStaking = await VulnerableStaking.deploy();
    await vulnerableStaking.deployed();
    // console.log(
    //   `VulnerableStaking Contract Address: ${vulnerableStaking.address}`
    // );
  });

  it("Should hack vulnerable staking contract", async function () {
    // deploy attacker contract by attacker account
    Attack = await ethers.getContractFactory("Attack");
    attack = await Attack.connect(attacker).deploy(vulnerableStaking.address);
    await attack.deployed();

    // user1 and user2 (victims) deposit to staking contract
    let tx = await vulnerableStaking
      .connect(user1)
      .deposit({ value: parseEther("5") });
    await tx.wait();
    console.log("User1 deposited 5 ETH to VulnerableStaking.");

    tx = await vulnerableStaking
      .connect(user2)
      .deposit({ value: parseEther("5") });
    await tx.wait();
    console.log("User2 deposited 5 ETH to VulnerableStaking.");

    // check that staking contract has 10 ether
    let balanceETH = await ethers.provider.getBalance(
      vulnerableStaking.address
    );
    expect(balanceETH).to.equal(parseEther("10"));
    console.log("VulnerableStaking has 10 ETH now.");

    // attacker starts to attack

    // tx = await attack.connect(attacker).attack({ value: parseEther("1") });
    // await tx.wait();

    // balanceETH = await ethers.provider.getBalance(attack.address);
    // expect(balanceETH).to.equal(11);

    console.log("Attacker will attack to VulnerableStaking now.");
    await expect(
      attack.connect(attacker).attack({ value: parseEther("1") })
    ).to.changeEtherBalance(attack.address, parseEther("11"));

    balanceETH = await ethers.provider.getBalance(vulnerableStaking.address);
    console.log(
      `ETH balance of Staking Contract is ${formatEther(balanceETH)}`
    );
    expect(balanceETH).to.equal(0);
  });

  it("Should NOT hack safe staking contract", async function () {
    // deploy attacker contract by attacker account
    Attack = await ethers.getContractFactory("Attack");
    attack = await Attack.connect(attacker).deploy(safeStaking.address);
    await attack.deployed();

    // user1 and user2 (victims) deposit to staking contract
    let tx = await safeStaking
      .connect(user1)
      .deposit({ value: parseEther("5") });
    await tx.wait();
    console.log("User1 deposited 5 ETH to SafeStaking.");

    tx = await safeStaking.connect(user2).deposit({ value: parseEther("5") });
    await tx.wait();
    console.log("User2 deposited 5 ETH to SafeStaking.");

    // check that staking contract has 10 ether
    let balanceETH = await ethers.provider.getBalance(safeStaking.address);
    expect(balanceETH).to.equal(parseEther("10"));
    console.log("SafeStaking has 10 ETH now.");

    // attacker starts to attack

    // tx = await attack.connect(attacker).attack({ value: parseEther("1") });
    // await tx.wait();

    // balanceETH = await ethers.provider.getBalance(attack.address);
    // expect(balanceETH).to.equal(11);
    console.log("Attacker will attack to VulnerableStaking now.");
    await expect(attack.connect(attacker).attack({ value: parseEther("1") })).to
      .be.reverted;
    balanceETH = await ethers.provider.getBalance(safeStaking.address);
    console.log(
      `ETH balance of Staking Contract is ${formatEther(balanceETH)}`
    );
    expect(balanceETH).to.equal(parseEther("10"));
  });
});
