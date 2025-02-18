"use client";
import { useState, useEffect, useContext } from "react";
import { NFTContext } from "@/context/NFTContext";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/Loader";
import NFTCard from "@/components/NFTCard";
import Image from "next/image";
import Button from "@/components/Button";
import images from "@/public/assets";
import { shortenAdress } from "@/utils/shortenAdress";
import Modal from "@/components/Modal";

const PaymentBodyCmp = ({ nft, nftCurrency }) => {
  return (
    <div className="flex flex-col">
      <div className="flexBetween">
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
          Item
        </p>
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
          Subtotal
        </p>
      </div>
      <div className="flexBetweenStart my-5">
        <div className="flex-1 flexStartCenter">
          <div className="relative w-28 h-28">
            <Image src={nft.image} alt="nft-image" fill style={{ objectFit: "cover" }} />
          </div>

          <div className="flexCenterStart flex-col ml-5">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
              {shortenAdress(nft.seller)}
            </p>
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
              {nft.name}
            </p>
          </div>
        </div>

        <div className="">
          <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl">
            {nft.price} <span className="font-semibold">{nftCurrency}</span>
          </p>
        </div>
      </div>
      <div className="flexBetween mt-10">
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base minlg:text-xl">
          Total
        </p>
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl">
          {nft.price} <span className="font-semibold">{nftCurrency}</span>
        </p>
      </div>
    </div>
  );
};

const NFTDetails = () => {
  const { currentAccount, nftCurrency,buyNFT } = useContext(NFTContext);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [nft, setNft] = useState({
    image: "",
    tokenId: "",
    name: "",
    owner: "",
    price: "",
    seller: "",
    description: "",
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;

    const nftData = {
      image: searchParams.get("image"),
      tokenId: searchParams.get("tokenId"),
      name: searchParams.get("name"),
      owner: searchParams.get("owner"),
      price: searchParams.get("price"),
      seller: searchParams.get("seller"),
      description: searchParams.get("description"),
    };

    setNft(nftData);
    setIsLoading(false);
  }, [searchParams]);

  const checkout = async () =>{
    await buyNFT(nft)
    setPaymentModal(false)
    setSuccess(true)
  }

  if (isLoading) return <Loader />;

  return (
    <div className="relative flex justify-center md:flex-col min-h-screen">
      <div className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
        <div className="realtive w-[557px] minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-[300px]">
          <Image
            className="rounded-lg shadow-lg"
            alt="nft_image"
            src={nft.image}
            width={500}
            height={500}
            style={{ objectFit: "cover" }}
          />{" "}
        </div>
      </div>
      <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
        <div className="flex flex-row sm:flex-col">
          <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">
            {nft.name}
          </h2>
        </div>
        <div className="mt-10 ">
          <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">
            Creator
          </p>
          <div className="flex flex-row items-center mt-3">
            <div className="relative w-12 h-12 minlg:w-[20px] minlg:h-[20px] mr-2">
              <Image
                src={images.creator1}
                alt="creator_image"
                className="rounded-full"
                style={{ objectFit: "cover" }}
              />
            </div>
            <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-semibold">
              {shortenAdress(nft.seller)}
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex- flex-row">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base mb-2 minlg:text-base font-medium">
              Details
            </p>
          </div>
          <div className="mt-3">
            <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal">
              {nft.description}
            </p>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col mt-10">
          {currentAccount === nft.seller.toLowerCase() ? (
            <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal border border-gray p-2">
              You Can't buy your own NFT
            </p>
          ) : (
            <Button
              classStyles="mr-5 sm:mr-0 rounded-xl"
              btnName={`Buy for ${nft.price} ${nftCurrency}`}
              handleClick={()=>{setPaymentModal(true)}}
            />
          )}
        </div>
      </div>

      {paymentModal && (
        <Modal
        header="Check Out"
        body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency} />}
        footer={
          <div className="flex flex-row sm:flex-col">
            <Button
              btnName="Checkout"
              classStyles="mr-5 sm:mb-5 sm:mr-0 rounded-xl"
              handleClick={checkout}
            />
            <Button
              btnName="Cancel"
              classStyles="rounded-xl"
              handleClick={() => setPaymentModal(false)}
            />
          </div>
        }
        handleClose={() => setPaymentModal(false)}
      />
      )}

      {successModal && (
        <Modal header="Payment Successfull" body={(<div className="flexCenter flex-col text-center" onClick={()=>setSuccess(false)}>
        <div className="relative w-52 h-52">
          <Image src={nft.image} style={{objectFit:"cover"}} alt="nft-image" fill/>
        </div>
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl mt-10">You Successfully Purchased <span className="font-semibold">{nft.name}  </span> from <span className="font-semibold">{shortenAdress(nft.seller)}</span> </p>
      </div>)}
        footer={
          <div className="flexCenter flex-col ">
            <Button
              btnName="Check it out"
              classStyles=" sm:mb-5 sm:mr-0 rounded-xl"
              handleClick={()=>router.push("/my-nfts")}
            />
            
          </div>
        }
        handleClose={() => setPaymentModal(false)}
      />
      )}

      
      
    </div>
  );
};

export default NFTDetails;
