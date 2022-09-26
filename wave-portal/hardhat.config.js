require("@nomiclabs/hardhat-waffle");


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "https://boldest-broken-silence.rinkeby.discover.quiknode.pro/ff26bbe60dfda484a56ff07b81965e811b9b2a00/",
      accounts: ["a6e806164514ef957a4fd244ef947750d981fa8d301ce1d0f148066e04485125"]
    },
  },
};

