"use client";
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { uploadFileToPinata, uploadJSONToPinata } from "@/utils/pinata";
import { MarketAddress, MarketAddressABI } from "./constants";
import axios from "axios";

export const NFTContext = React.createContext();

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoadingNft, setIsLoadingNft] = useState(false)
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
    if (!window.ethereum) return alert("Please install MetaMask");
  
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
  
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (error) {
      if (error.code === 4001) {
        
        alert("First connect to your MetaMask Wallet");
      } else {
        console.error("Error connecting wallet:", error);
      }
    }
  };
  

  const uploadToPinata = async (file) => {
    return await uploadFileToPinata(file);
  };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;

    if (!name || !description || !price || !fileUrl) return;

    const data = { name, description, image: fileUrl };

    try {
      const url = await uploadJSONToPinata(data);
      await createSale(url, price);
      router.push("/");
    } catch (error) {
      console.log("Error uploading to Pinata", error);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, "ether");
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();

    const transaction= !isReselling
    ? await contract.createToken(url,price, {value:listingPrice.toString()})
    : await contract.resellToken(id,price,{value:listingPrice.toString()});

    setIsLoadingNft(true)
    await transaction.wait();
  };

  const fetchNFTs = async () => {
    setIsLoadingNft(false)
    const url = process.env.NEXT_PUBLIC_ALCHEMY_API_URL;
    const provider = new ethers.providers.JsonRpcProvider(url);

    const contract = fetchContract(provider);

    const data =await contract.fetchMarketItems();
    console.log(data)

    const items = await Promise.all(data.map(async({tokenId,seller,owner,price:unformattedPrice})=>{
      const tokenURI = await contract.tokenURI(tokenId);
      const {data:{image,name,description}}= await axios.get(tokenURI);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(),"ether");
      

      return {
        price,
        tokenId:tokenId.toNumber(),
        seller,
        owner,
        image,
        description,
        name,
        tokenURI
      }
    }))
    console.log(items)
    return items;
  };

  const fetchMyNFTsOrListedNFTs = async (type) =>{
    setIsLoadingNft(false)
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();

    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = fetchContract(signer);

    const data = type === "fetchItemsListed"
      ? await contract.fetchitemsListed()
      : await contract.fetchMyNFTs()

      const items = await Promise.all(data.map(async({tokenId,seller,owner,price:unformattedPrice})=>{
        const tokenURI = await contract.tokenURI(tokenId);
        const {data:{image,name,description}}= await axios.get(tokenURI);
        const price = ethers.utils.formatUnits(unformattedPrice.toString(),"ether");
        
  
        return {
          price,
          tokenId:tokenId.toNumber(),
          seller,
          owner,
          image,
          description,
          name,
          tokenURI
        }
      }))
      return items;
  }
  
  const buyNFT = async (nft) =>{
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction  = await contract.createMarketSale(nft.tokenId,{value:price});

    setIsLoadingNft(true)
    await transaction.wait()
    setIsLoadingNft(false)

  }


  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        connectWallet,
        currentAccount,
        uploadToPinata,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        createSale,
        isLoadingNft
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
