"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { NFTContext } from "@/context/NFTContext";
import Image from "next/image";
import Link from "next/link";
import images from "@/public/assets";
import Button from "./Button";

const MenuItems = ({ isMobile, active, setActive }) => {
  const generateLink = (i) => {
    switch (i) {
      case 0:
        return "/";
      case 1:
        return "/created-nfts";
      case 2:
        return "/my-nfts";
      default:
        return "/";
    }
  };
  return (
    <ul
      className={`list-none flexCenter flex-row ${isMobile && "flex-col h-full"}`}
    >
      {["Explore NFTs", "Listed NFTs", "My NFTs"].map((item, i) => (
        <li
          key={i}
          onClick={() => setActive(item)}
          className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 
          ${
            active === item
              ? "dark:text-white text-nft-black-1"
              : "dark:text-nft-gray-3 text-nft-gray-2"
          }`}
        >
          <Link href={generateLink(i)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
};
const ButtonGroup = ({ setActive, router }) => {
  const {connectWallet,currentAccount} =useContext(NFTContext)
   
  return currentAccount ? (
    <Button
      btnName="Create"
      classStyles="mx-2 rounded-xl"
      handleClick={() => {
        setActive("");
        router.push("/create-nft");
      }}
    />
  ) : (
    <Button
      btnName="Connect"
      classStyles="mx-2 rounded-xl"
      handleClick={connectWallet}
    />
  );
};
const Navbar = () => {
  const { theme, setTheme } = useTheme();
  // const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const [active, setActive] = useState("Explore NFTs");
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setMounted(true);
  //   }
  // }, []);

  // if (!mounted) return null;
  return (
    <nav className="flexBetween w-full fixed z-10 p-4 flex-row border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1">
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div
            className="flexCenter cursor-pointer md:hidden"
            onClick={() => {}}
          >
            <Image src={images.logo02} alt="logo" width={32} height={32} />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">
              CryptoKet
            </p>
          </div>
        </Link>
        <Link href="/">
          <div className="hidden md:flex " onClick={() => {}}>
            <Image src={images.logo02} alt="logo" width={32} height={32} />
          </div>
        </Link>
      </div>
      <div className="flex flex-initial flex-row justify-end ">
        <div className="flex items-center mr-10">
          
            <input
              type="checkbox"
              className="checkbox"
              id="checkbox"
              onChange={() => setTheme(theme === "light" ? "dark" : "light")}
            />
       
          <label
            htmlFor="checkbox"
            className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label"
          >
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div>
        <div className="flex md:hidden">
          <MenuItems active={active} setActive={setActive} />
          <div className="ml-4">
            <ButtonGroup router={router} setActive={setActive} />
          </div>
        </div>
      </div>
      <div className="hidden md:flex ml-2">
        {isOpen ? (
          <Image
            src={images.cross}
            style={{ objectFit: "contain" }}
            width={20}
            height={20}
            alt="close"
            onClick={() => setIsOpen(false)}
            className={theme === "light" ? "filter invert" : ""}
          />
        ) : (
          <Image
            src={images.menu}
            style={{ objectFit: "contain" }}
            width={25}
            height={25}
            alt="menu"
            onClick={() => setIsOpen(true)}
            className={theme === "light" ? "filter invert" : ""}
          />
        )}
        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4">
              <MenuItems active={active} setActive={setActive} isMobile />
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1">
              <ButtonGroup router={router} setActive={setActive} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
