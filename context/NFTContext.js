"use client";
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";

import { MarketAddress, MarketAddressABI } from "./constants";

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const nftCurrency = "ETH";

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({ method: "eth_accounts" });

    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No accounts Found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install Metamask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    window.location.reload();
  };


const uploadToPinata = async (file) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_KEY_SECRET;

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );

    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    return ipfsUrl;
  } catch (error) {
    console.error("Pinata yükleme hatası:", error);
    return null;
  }
};


  return (
    <NFTContext.Provider value={{ nftCurrency, connectWallet, currentAccount, uploadToPinata }}>
      {children}
    </NFTContext.Provider>
  );
};
