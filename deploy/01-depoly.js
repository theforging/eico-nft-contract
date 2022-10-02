const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  console.log(`Deployer Address: ${deployer} | Chain ID: ${chainId}`);

  const eicoNft = await deploy("EicoNft", {
    from: deployer,
    args: [],
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`EicoNft deployed at ${eicoNft}`);

  if (
    network.name != "localhost" &&
    network.name != "hardhat" &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(eicoNft.address, []);
  }
};

module.exports.tags = ["all", "eiconft"];
