const { ethers, network } = require("hardhat");
const { expect, assert } = require("chai");
const { BigNumber } = require("ethers");

describe("Eico-NFT", function () {
  let EicoNftFactory, EicoNft;
  const EicoNFTTokenID = 1;
  console.log(`---------  Testing on ${network.name} --------`);

  beforeEach(async function () {
    EicoNftFactory = await ethers.getContractFactory("EicoNft");
    EicoNft = await EicoNftFactory.deploy();
  });

  it("Only owner can mint", async function () {
    const accounts = await ethers.getSigners();
    const EicoNFTConnectedContract = await EicoNft.connect(accounts[1]);
    await expect(EicoNFTConnectedContract.mint(accounts[1].address, 1)).to.be
      .reverted;
  });

  it("Only owner can air drop", async function () {
    const accounts = await ethers.getSigners();
    const EicoNFTConnectedContract = await EicoNft.connect(accounts[1]);
    await expect(
      EicoNFTConnectedContract.batchAirDrop([
        accounts[1].address,
        accounts[2].address,
        accounts[3].address,
      ])
    ).to.be.reverted;
  });

  it("Only owner can change URI", async function () {
    const accounts = await ethers.getSigners();
    const EicoNFTConnectedContract = await EicoNft.connect(accounts[1]);
    await expect(
      EicoNFTConnectedContract.setURI(
        "ipfs://bafkreia4kwaao3xxvo43lwvmjru6f7larb3kxns72l6nh4x4tcif6cp2rq"
      )
    ).to.be.reverted;
  });

  it("Should mint 1 NFT to single holder", async function () {
    const accounts = await ethers.getSigners();
    const holder1 = accounts[1];

    await EicoNft.mint(holder1.address, 1);
    const holderBalance = await EicoNft.balanceOf(
      holder1.address,
      EicoNFTTokenID
    );
    console.log(`Holder balance : ${holderBalance}`);
    assert.equal(1, holderBalance);
  });

  it("Should burn 1 NFT from single holder", async function () {
    const accounts = await ethers.getSigners();
    const holder1 = accounts[1];

    await EicoNft.mint(holder1.address, 1);
    let holderBalance = await EicoNft.balanceOf(
      holder1.address,
      EicoNFTTokenID
    );
    console.log(`Holder balance Before Burn: ${holderBalance}`);
    assert.equal(1, holderBalance);

    await EicoNft.burnNFT(holder1.address, 1);

    holderBalance = await EicoNft.balanceOf(holder1.address, EicoNFTTokenID);
    console.log(`Holder balance After Burn: ${holderBalance}`);
    assert.equal(0, holderBalance);
  });

  it("Total NFT count should increase 1 after mint", async function () {
    const before = await EicoNft.getTotalSupply();
    console.log(`Total Supply before : ${before}`);

    const accounts = await ethers.getSigners();
    await EicoNft.mint(accounts[1].address, 1);

    const after = await EicoNft.getTotalSupply();
    console.log(`Total Supply after : ${after}`);

    assert.equal(before + 1, after.toNumber());
  });

  it("Owner can air drop to multiple addresses", async function () {
    const accounts = await ethers.getSigners();
    await EicoNft.batchAirDrop([
      accounts[1].address,
      accounts[2].address,
      accounts[3].address,
    ]);
    let holderBalance = await EicoNft.balanceOf(
      accounts[1].address,
      EicoNFTTokenID
    );
    assert.equal(1, holderBalance, "Holder 1");
    holderBalance = await EicoNft.balanceOf(
      accounts[2].address,
      EicoNFTTokenID
    );
    assert.equal(1, holderBalance, "Holder 2");
    holderBalance = await EicoNft.balanceOf(
      accounts[3].address,
      EicoNFTTokenID
    );
    assert.equal(1, holderBalance, "Holder 3");
  });

  it("Can change URI", async function () {
    await EicoNft.setURI("ipfs://this_is_test_URI");

    const newURI = await EicoNft.uri(EicoNFTTokenID);
    assert.equal(newURI, "ipfs://this_is_test_URI");
  });

  it("Can change Name and Symbol", async function () {
    await EicoNft.setNameAndSymbol("Name", "Symbol");

    const newName = await EicoNft.name();
    const newSymbol = await EicoNft.symbol();
    assert.equal(newName, "Name");
    assert.equal(newSymbol, "Symbol");
  });
});
