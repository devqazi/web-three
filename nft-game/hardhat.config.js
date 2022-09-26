require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.1",
  networks: {
    goreli: {
      url: "https://dimensional-billowing-meadow.ethereum-goerli.discover.quiknode.pro/129a5d7a36529e49f7301c5eeddc4a7d2b6bf8c7/",
      accounts: ["a6e806164514ef957a4fd244ef947750d981fa8d301ce1d0f148066e04485125"],
    },
  },
};
