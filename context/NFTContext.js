"use client"
import React,{useState,useEffect} from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import axios from "axios";

import { MarketAddress,MarketAddressABI } from "./constants";

export const NFTContext = React.createContext();

export const NFTProvider=({children})=>{
    
    const [currentAccount,setCurrentAccount]=useState("");
    const nftCurrency="ETH";

    const checkIfWalletIsConnected=()=>{
        if(!window.ethereum) return alert("Please install MetaMask")
    }

    return(
        <NFTContext.Provider value={{nftCurrency}}>
            {children}
        </NFTContext.Provider>
    )
}