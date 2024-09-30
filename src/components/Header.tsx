/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import axios from "axios"
import { injected } from "../connecthook/connect";
import { switchNetwork, switchNetwork1, switchNetwork2 } from "../connecthook/switch-network";
import { FaWallet } from "react-icons/fa";
import { UserContext, UserProvider } from "../context/UserProvider";
export default function Header() {
  const router = useRouter();
  // const [open, setOpen] = useState(false);
  const { title, setTitle } = useContext(UserContext)
  const { account, chainId, activate, deactivate } = useWeb3React();
  async function connect() {
    if (chainId !== 16 || chainId === undefined) {
      switchNetwork();
    }
    try {
      console.log("clicked");
      await activate(injected);
      localStorage.setItem("isWalletConnected", "true");
    } catch (ex) {
      console.log(ex);
    }
  }
  async function connect1() {
    if (chainId !== 80001 || chainId === undefined) {
      switchNetwork1();
    }
    try {
      console.log("clicked");
      await activate(injected);
      localStorage.setItem("isWalletConnected", "true");
    } catch (ex) {
      console.log(ex);
    }
  }
  async function connect2() {
    if (chainId !== 97 || chainId === undefined) {
      switchNetwork2();
    }
    try {
      console.log("clicked");
      await activate(injected);
      localStorage.setItem("isWalletConnected", "true");
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.setItem("isWalletConnected", "false");
    } catch (ex) {
      console.log(ex);
    }
  }

  useEffect(() => {
    const connectWalletOnPageLoad = async () => {
      if (localStorage?.getItem("isWalletConnected") === "true") {
        try {
          await activate(injected);
          localStorage.setItem("isWalletConnected", "true");

        } catch (ex) {
          console.log(ex);
        }
      }
    };
    connectWalletOnPageLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!account) {
      setTitle("Keep clean your wallet by Burning unwanted/scam NFTs in few clicks");
      return;
    } else {
      setTitle("Select below the NFTs you want to burn");
    }
  }, [account])

  return (
    <header className="bg-black w-full h-[80px] flex justify-between lg:px-[30px] pt-5 md:px-[10px] z-[49] py-3 items-center px-4">
      <Head>
        <link rel="icon" href="/img/logo.png" />
        <title>The Incinerator</title>
      </Head>
      <a href={`https://hellains.com`}>
        <div className="cursor-pointer w-[100px] h-[100px]">
          <img
            src="/img/logo.png"
            className="object-cover object-center p-2"
            alt="logo"
          />
        </div>
      </a>
      <div
        className="items-center mt-10 h-full px-4 py-5 text-white md:flex justify-between gap-10 md:text-[22px] text-[14px]"
      >
        {title}
      </div>

      <div className="flex items-center">
        {/* <Link href={"https://doodlebunnyflr.live/mint"} passHref>
          <li
            className={`text-[1.5rem] hover:text-white duration-300 transition-all cursor-pointer gradient_link ${
              router.pathname === "/" ? "text-red-500 underline" : ""
            }`}
          >
            Mint
          </li>
        </Link> */}
        {account ? (
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 text-white rounded-xl font-normal text-[22px] bg-[#ff0000]"
          >
            <span className="flex gap-2 font-normal text">
              <FaWallet style={{ marginTop: "3%" }} />
              {account && account.slice(0, 4) + "..." + account.slice(-4)}
            </span>
          </button>
        ) : (
          <button
            onClick={() => connect1()}
            className="px-4 py-2 text-white rounded-xl font-normal text-[22px] bg-[#ff0000]"
          >
            <span className="flex gap-2 font-normal text">Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
}
