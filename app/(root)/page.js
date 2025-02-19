"use client";
import { useState, useEffect, useRef,useContext } from "react";
import Banner from "@/components/Banner";
import CreatorCard from "@/components/CreatorCard";
import images from "@/public/assets";
import { makeId } from "@/utils/makeId";
import Image from "next/image";
import { useTheme } from "next-themes";
import NFTCard from "@/components/NFTCard";
import { NFTContext } from "@/context/NFTContext";
import { getCreators } from "@/utils/getTopCreators";
import { shortenAdress } from "@/utils/shortenAdress";
import SearchBar from "@/components/SearchBar";

const Home = () => {
  const [hideButtons, setHideButtons] = useState(false);
  const [nfts, setNfts] = useState([])
  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const {fetchNFTs}=useContext(NFTContext)
  const [nftsCopy, setNftsCopy] = useState([])
  const [activeSelect, setActiveSelect] = useState("Recently Added")

  useEffect(()=>{
    fetchNFTs().then((items)=>{
      setNfts(items)
      setNftsCopy(items)
    })
  },[])

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case "Price (low to high)":
        setNfts(sortedNfts.sort((a, b) => a.price - b.price));
        console.log(nfts)
        break;
      case "Price (high to low)":
        setNfts(sortedNfts.sort((a, b) => b.price - a.price));
        break;
      case "Recently Added":
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  const onHandleSearch = (value) => {
    const filteredNfts = nfts.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase()),
    );

    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === "left") {
      current.scrollLeft -= scrollAmount; // corrected typo
    } else {
      current.scrollLeft += scrollAmount; // corrected typo
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };
  useEffect(() => {
    isScrollable();
    window.addEventListener("resize", isScrollable);

    return () => {
      window.removeEventListener("resize", isScrollable);
    };
  });

  const topCreators=getCreators(nftsCopy)

  return (
    <div className="flex justify-center sm:px-4 px-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          name="Discover, collect, and sell extraordinary NFTs"
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
        />

        <div>
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl text-semibold ml-4 xs:ml-0">
            Best Creators
          </h1>
          <div className="relative flex-1 max-w-full flex mt-3" ref={parentRef}>
            <div
              className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
              ref={scrollRef}
            >
              {topCreators.map((creator,i) => (
                <CreatorCard
                  key={creator.seller}
                  rank={i+1}
                  creatorImage={images[`creator${i+1}`]}
                  creatorName={shortenAdress(creator.seller)}
                  creatorEths={creator.sum}
                />
              ))}

              {!hideButtons && (
                <>
                  <div
                    onClick={() => handleScroll("left")}
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                  >
                    <Image
                      fill
                      src={images.left}
                      style={{ objectFit: "contain" }}
                      alt="left_arrow"
                      className={theme === "light" ? "filter invert" : ""}
                    />
                  </div>
                  <div
                    onClick={() => handleScroll("right")}
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                  >
                    <Image
                      fill
                      src={images.right}
                      style={{ objectFit: "contain" }}
                      alt="left_arrow"
                      className={theme === "light" ? "filter invert" : ""}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
              Hot Bids
            </h1>
            <div className="flex-2 sm:w-full flex flex-row sm:flex-col ">
            <SearchBar
              activeSelect={activeSelect}
              setActiveSelect={setActiveSelect}
              handleSearch={onHandleSearch}
              clearSearch={onClearSearch}
            />
            </div>
          </div>
          <div className="mt-3 w-full flex flex-wrap justify-between md:justify-center">
            {nfts.map((nft)=><NFTCard key={nft.tokenId} nft={nft}/>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
