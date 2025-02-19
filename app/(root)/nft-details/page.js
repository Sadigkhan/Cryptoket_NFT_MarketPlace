"use client"
import {useState,useEffect,useContext} from 'react'
import { NFTContext } from '@/context/NFTContext'
import { useRouter } from 'next/compat/router'
import Loader from '@/components/Loader'
import NFTCard from '@/components/NFTCard'
import Image from 'next/image'
import Button from '@/components/Button'
import images from "@/public/assets"
import { shortenAdress } from '@/utils/shortenAdress'


const NFTDetails = () => {
  const {currentAccount}=useContext(NFTContext)
  const [isLoading, setIsLoading] = useState(true)
  const [nft, setNft] = useState({image:"",tokenId:"",name:"",owner:"",price:"",seller:""})
  const router = useRouter()
  useEffect(()=>{
    if(!router.isReady) return;
    setNft(router.query)
    setIsLoading(false)
  },[router.isReady])

  console.log(router)
  if(isLoading)  return <Loader/>

  return (
    <div className='relative flex justify-center md:flex-col min-h-screen'>
      <div className='relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1'>
        <div>
          <Image alt='nft_image' src={nft.image}/>
        </div>
      </div>
    </div>
  )
}

export default NFTDetails