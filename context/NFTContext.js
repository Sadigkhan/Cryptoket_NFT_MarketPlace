"use client";
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { uploadFileToPinata, uploadJSONToPinata } from "@/utils/pinata"; 
import { MarketAddress, MarketAddressABI } from "./constants";

export const NFTContext = React.createContext();

const fetchContract=(signerOrProvider)=> new ethers.Contract(MarketAddress,MarketAddressABI,signerOrProvider);

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
    return await uploadFileToPinata(file);
  };

  const createSale = async (url,formInputPrice,isReselling,id) => {
    const web3modal = new Web3Modal();
    const connection =await web3modal.connect();
    const provider =new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    
    const price= ethers.utils.parseUnits(formInputPrice,"ether");
    const contract = fetchContract(signer);
    const listingPrice= await contract.getListingPrice();

    const transaction= await contract.createToken(url,price, {value:listingPrice.toString()});
    await transaction.wait();


  }

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;

    const data = { name, description, image: fileUrl };

    try {
      const url = await uploadJSONToPinata(data);
      await createSale(url, price);
      router.push('/');
    } catch (error) {
      console.log("Error uploading to Pinata", error);
    }
  };

  return (
    <NFTContext.Provider
      value={{ nftCurrency, connectWallet, currentAccount, uploadToPinata, createNFT }}
    >
      {children}
    </NFTContext.Provider>
  );
};
