const fs = require("fs");
require("@nomiclabs/hardhat-waffle");

const privateKey=fs.readFileSync(".secret").toString().trim()

module.exports = {
  netwokrs:{
    hardhat:{
      chainId:1337
    }
  },
  solidity: "0.8.4",
};
