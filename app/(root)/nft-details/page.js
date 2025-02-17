"use client"
import { useState, useEffect, useContext } from 'react';
import { NFTContext } from '@/context/NFTContext';
import { useSearchParams } from 'next/navigation'; 
import Loader from '@/components/Loader';
import NFTCard from '@/components/NFTCard';
import Image from 'next/image';
import Button from '@/components/Button';
import images from "@/public/assets";
import { shortenAdress } from '@/utils/shortenAdress';

const NFTDetails = () => {
  const { currentAccount,nftCurrency } = useContext(NFTContext);
  const [isLoading, setIsLoading] = useState(true);
  const [nft, setNft] = useState({ image: "", tokenId: "", name: "", owner: "", price: "", seller: "",description:"" });
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const nftData = {
      image: searchParams.get('image'),
      tokenId: searchParams.get('tokenId'),
      name: searchParams.get('name'),
      owner: searchParams.get('owner'),
      price: searchParams.get('price'),
      seller: searchParams.get('seller'),
      description:searchParams.get("description")
    };

    setNft(nftData);
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) return <Loader />;

  return (
    <div className='relative flex justify-center md:flex-col min-h-screen'>
      <div className='relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1'>
        <div className='realtive w-[557px] minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-[300px]'>
          <Image className='rounded-lg shadow-lg' alt='nft_image' src={nft.image} width={500} height={500} style={{objectFit:"cover"}}/> {/* Added width and height */}
        </div>
      </div>
      <div className='flex-1 justify-start sm:px-4 p-12 sm:pb-4'>
        <div className='flex flex-row sm:flex-col'>
          <h2 className='font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl'>{nft.name}</h2>
        </div>
        <div className='mt-10 '>
          <p className='font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal'>Creator</p>
          <div className='flex flex-row items-center mt-3'>
            <div className='relative w-12 h-12 minlg:w-[20px] minlg:h-[20px] mr-2'>
              <Image src={images.creator1} alt='creator_image' className='rounded-full' style={{objectFit:"cover"}}/>
            </div>
            <p className='font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-semibold'>{shortenAdress(nft.seller)}</p>
          </div>
        </div>
        <div className='mt-10 flex flex-col'>
          <div className='w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex- flex-row'>
            <p className='font-poppins dark:text-white text-nft-black-1 text-base mb-2 minlg:text-base font-medium'>Details</p>
          </div>
          <div className='mt-3'>
            <p className='font-poppins dark:text-white text-nft-black-1 text-base font-normal'>{nft.description}</p>
          </div>
        </div>
        <div className='flex flex-row sm:flex-col mt-10'>
          {currentAccount===nft.seller.toLowerCase() 
          ? (
              <p className='font-poppins dark:text-white text-nft-black-1 text-base font-normal border border-gray p-2'>You Can't buy your own NFT</p>
            )
          : (
              <Button classStyles="mr-5 sm:mr-0 rounded-xl" btnName={`Buy for ${nft.price} ${nftCurrency}`}/>
            )}
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;