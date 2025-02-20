const fs = require("fs");
require("dotenv").config({ path: ".env.local" }); 

require("@nomiclabs/hardhat-waffle");

// const privateKey=fs.readFileSync(".secret").toString().trim()

module.exports = {
  networks:{
    sepolia: {
      url: process.env.NEXT_ALCHEMY_API_URL,
      accounts: [NEXT_Public_METAMASK_PRIVATE_KEY],
    },
  },
  solidity: "0.8.4",
};
