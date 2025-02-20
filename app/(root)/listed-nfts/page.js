"use client";
import { useState, useEffect, useContext } from "react";
import { NFTContext } from "@/context/NFTContext";
import NFTCard from "@/components/NFTCard";
import Loader from "@/components/Loader";
import Button from "@/components/Button"; // Eğer Button bileşeni varsa ekledim, yoksa bunu çıkarabilirsin.

const ListedNFTs = () => {
  const { fetchMyNFTsOrListedNFTs, currentAccount, connectWallet } = useContext(NFTContext);
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [walletRejected, setWalletRejected] = useState(false);

  // useEffect(() => {
  //   fetchMyNFTsOrListedNFTs("fetchItemsListed").then((items) => {
  //     setNfts(items);
  //     setIsLoading(false);
  //   });
  // }, []);

  useEffect(() => {
    if (!currentAccount) return; // Eğer cüzdan bağlı değilse, NFT'leri çekme

    setIsLoading(true);
    fetchMyNFTsOrListedNFTs("fetchItemsListed")
      .then((items) => {
        setNfts(items);
      })
      .catch((error) => {
        console.error("Error fetching NFTs:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentAccount])

  const handleConnectWallet = async () => {
    try {
      await connectWallet(); // NFTContext içindeki cüzdan bağlantısını çağır
    } catch (error) {
      if (error.code === 4001) {
        setWalletRejected(true); // Kullanıcı bağlantıyı reddettiyse durumu güncelle
      } else {
        console.error("Wallet connection error:", error);
      }
    }
  };

  if (walletRejected) {
    return (
      <div className="flexCenter min-h-screen flex-col">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">
          First connect to your MetaMask Wallet
        </p>
        <Button
          btnName="Connect Wallet"
          classStyles="mx-2 rounded-xl mt-4"
          handleClick={handleConnectWallet}
        />
      </div>
    );
  }

  if (!currentAccount) {
    return (
      <div className="flexCenter min-h-screen flex-col">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">
          First connect to your MetaMask Wallet
        </p>
        <Button
          btnName="Connect Wallet"
          classStyles="mx-2 rounded-xl mt-4"
          handleClick={handleConnectWallet}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flexCenter sm:p-4 p-16 min-h-screen">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">
          No NFTs listed for sale
        </h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12 min-h-screen">
      <div className="w-full minmd:w-4/5">
        <div className="mt-4">
          <h2 className="font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2">
            NFTs Listed for Sale
          </h2>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nfts.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedNFTs;
