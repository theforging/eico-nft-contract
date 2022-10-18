const { ethers, network } = require("hardhat");

async function main() {
  EicoNftFactory = await ethers.getContractFactory("EicoNft");
  EicoNft = await EicoNftFactory.attach(
    "" //contract address
  );

  await EicoNft.transferOwnership(""); //eico  address

  console.log("Ownership Transferred!");
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
