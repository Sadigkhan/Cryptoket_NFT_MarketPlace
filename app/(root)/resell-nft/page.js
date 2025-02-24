"use client"; // Ensure this is at the top
import { useState, useEffect, useContext, Suspense } from 'react';
import { NFTContext } from '@/context/NFTContext';
import { useSearchParams, useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import Button from '@/components/Button';
import Input from '@/components/Input';
import axios from 'axios';

// Wrap the main logic in a separate component for Suspense
const ResellNFTContent = () => {
  const { createSale, isLoadingNft } = useContext(NFTContext);
  const [nft, setNft] = useState({
    tokenId: "",
    tokenURI: "",
  });
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!searchParams) return;
    const nftData = {
      tokenId: searchParams.get("tokenId"),
      tokenURI: searchParams.get("tokenURI"),
    };
    setNft(nftData);
  }, [searchParams]);

  useEffect(() => {
    if (nft.tokenURI) fetchNFT();
  }, [nft.tokenURI]);

  const fetchNFT = async () => {
    if (!nft.tokenURI) return;
    try {
      const { data } = await axios.get(nft.tokenURI);
      setPrice(data.price);
      setImage(data.image);
    } catch (error) {
      console.error("Error fetching NFT data:", error);
    }
  };

  const resell = async () => {
    await createSale(nft.tokenURI, price, true, nft.tokenId);
    router.push("/");
  };

  if (isLoadingNft) {
    return (
      <div className='flexStart min-h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='flex justify-center sm:px-4 p-12'>
      <div className='w-3/5 md:w-full'>
        <h1 className='font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl'>Resell NFT</h1>
        <Input inputType="number" title="Price" placeholder="NFT Price" handleClick={(e) => setPrice(e.target.value)} />
        {image && <img src={image} className='rounded mt-4' width={350} />}

        <div className='mt-7 w-full flex justify-end'>
          <Button btnName="List NFT" classStyles="rounded-xl" handleClick={resell} />
        </div>
      </div>
    </div>
  );
};

// Wrap ResellNFTContent in Suspense
const ResellNFT = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ResellNFTContent />
    </Suspense>
  );
};

export default ResellNFT;