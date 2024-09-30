/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useContext, useMemo } from "react";
import type { NextPage } from "next";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from 'next/router';
import { ethers } from "ethers";
import axios from "axios"
import { BulkABI, BurningABI, ERC721ABI } from "../utils/abi";
import { injected } from "../connecthook/connect";
import { switchNetwork, switchNetwork1, switchNetwork2 } from "../connecthook/switch-network";
import { initializeApp } from "firebase/app";
import { UserContext, UserProvider } from "../context/UserProvider";
import ReactModal from "react-modal";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { addDoc, doc, getDocs, collection } from "@firebase/firestore"
import Link from "next/link";
interface TokenAPISimple {
  mintId?: string;
  title?: string;
  image?: string;
  listedForSale?: boolean;
  price?: string | number;
  offerPrice?: string | number;
  last?: string | number;
  collectionId?: string;
  saleId?: string;
  type: string;
}
interface burnListType {
  collectionId: string;
  image: string;
  listForSale: string;
  mintId: string;
  title: string;
  type: string
}
interface WindowWithEthereum extends Window {
  ethereum?: any;
}
const firebaseConfig = {
  apiKey: "AIzaSyBVaFTH7NvdupuhqIt2bTixbu9mLR7lcmA",
  authDomain: "aaaa-9deb4.firebaseapp.com",
  projectId: "aaaa-9deb4",
  storageBucket: "aaaa-9deb4.appspot.com",
  messagingSenderId: "14635051662",
  appId: "1:14635051662:web:6a978e06518facdffd77df",
  measurementId: "G-45BCZWZ44Y"
};

const appOffire = initializeApp(firebaseConfig);
const db = getFirestore(appOffire);

const Home: NextPage = () => {
  const { chainId, activate, deactivate } = useWeb3React();
  const { title, setTitle } = useContext(UserContext)
  //goerli testnet
  async function connect() {
    if (chainId !== 5 || chainId === undefined) {
      await switchNetwork();
      alert("Your network has changed.Please Burn")
    }
    try {
      console.log("clicked", account);
      await activate(injected);
      localStorage.setItem("isWalletConnected", "true");
    } catch (ex) {
      console.log(ex);
    }
  }
  //Polygon mainnet
  async function connect1() {
    if (chainId !== 137 || chainId === undefined) {
      await switchNetwork1();
      alert("Your network has changed.Please Burn")
    }
    try {
      console.log("clicked", account);
      await activate(injected);
      localStorage.setItem("isWalletConnected", "true");
    } catch (ex) {
      console.log(ex);
    }
  }
  //BSC mainnet
  async function connect2() {
    if (chainId !== 56 || chainId === undefined) {
      await switchNetwork2();
      alert("Your network has changed.Please Burn")
    }
    try {
      console.log("clicked", account);
      await activate(injected);
      localStorage.setItem("isWalletConnected", "true");
    } catch (ex) {
      console.log(ex);
    }
  }
  // const { address } = useAccount();
  const [length, setLength] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const router = useRouter();
  const { account } = useWeb3React();
  const [nftData, setNftData] = useState<[TokenAPISimple]>();
  const provider =
    typeof window !== "undefined" && (window as WindowWithEthereum).ethereum
      ? new ethers.providers.Web3Provider(
        (window as WindowWithEthereum).ethereum
      )
      : null;

  const Signer = provider?.getSigner();
  const [selectedNfts, setSelectedNfts] = useState<{
    image: string,
    collectionId: string,
    mintId: string,
    type: string,
    title: string
  }[]>([]);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string[]>([]);
  const [burningContractAddress, setBurningContractAddress] = useState("0x937E99E055F14a8E403bF08936B5c651F5ce7B9a")
  const addData = async (data: string) => {
    const docRef = await addDoc(collection(db, "imageSrc"), {
      data,
      account
    });
  }

  const addtxData = async (data: string) => {
    const docRef = await addDoc(collection(db, "txdata"), {
      data,
      account
    });
  }
  useEffect(() => {
    const getTxDataLength = async () => {
      const snapshot = await getDocs(collection(db, "txdata"));
      let cnt = 0;

      snapshot.docs.forEach((index) => {
        if (index.data()['account'] === account) {
          cnt++;
        }
      })
      return cnt;
    }

    // Usage:
    getTxDataLength().then((length) => setLength(length));

  }, [nftData])
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [tx, setTx] = useState<string[]>([]);

  const getImageUrl = async () => {
    try {
      const citiesRef = collection(db, 'imageSrc');
      const docSnap = await getDocs(citiesRef);
      docSnap.docs.forEach((index) => {
        // const url = index.data();
        if (index.data()['account'] === account as string) {
          setImgUrl((prevUrls) => [...prevUrls, index.data()['data']]);
        } else {
          // setImgUrl([])
        }
      })

      // Do something with docSnap
    } catch (error) {
      console.error("get image url error: ", error);
    }
    console.log(imgUrl)
  }
  const getTxdata = async () => {
    try {
      const citiesRef = collection(db, 'txdata');
      const docSnap = await getDocs(citiesRef);
      docSnap.docs.forEach((index) => {
        if (index.data()['account'] === account as string) {
          setTx((prevUrls) => [...prevUrls, index.data()['data']]);
        } else {
        }
      })
      // Do something with docSnap
    } catch (error) {
      console.error("get tx error: ", error);
    }
  }
  const [transactions, setTransactios] = useState<any[]>([]);
  const [isLoad, setLoad] = useState(false);
  const [isBurned, setIsBurned] = useState(false);
  useEffect(() => {
    if (isBurned) {
      getTxdata();
      getImageUrl();
    }
  }, [isBurned])
  const getNfts = async (address: string) => {
    const optionsGoerli = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
      params: {
        chain: "goerli",
        format: "decimal",
        limit: "100",
        normalizeMetadata: "false",
      },
      headers: {
        accept: "application/json",
        "X-API-Key":
          "LQwowRmcRVa73zNkeBGemMYeyzmfeFE5umPyjXEcPh5wtW0oId9D5mUjdp3W7YpX", //Private-key
      },
    };

    const optionsMumbai = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
      params: {
        chain: "polygon",
        format: "decimal",
        limit: "100",
        normalizeMetadata: "false",
      },
      headers: {
        accept: "application/json",
        "X-API-Key":
          "txJymH9SlL82I0qIU2hbum8ttctYpGQgZlH4ebCBOpJuqjEU73CGI1cgcApZEnrh", //Private-key
      },
    };
    const optionsBsc = {
      method: "GET",
      url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
      params: {
        chain: "bsc",
        format: "decimal",
        limit: "100",
        normalizeMetadata: "false",
      },
      headers: {
        accept: "application/json",
        "X-API-Key":
          "LQwowRmcRVa73zNkeBGemMYeyzmfeFE5umPyjXEcPh5wtW0oId9D5mUjdp3W7YpX", //Private-key
      },

    };
    try {
      const [responseGoerli, responseMumbai, responseBsc] = await Promise.all([
        axios.request(optionsGoerli),
        axios.request(optionsMumbai),
        axios.request(optionsBsc),
      ]);
      console.log(responseMumbai, "Polygon")
      console.log(responseGoerli, "Goerli")
      const goerliNfts = (responseGoerli.data.result as TokenAPISimple[]).map(nft => ({ ...nft, type: "GOERLI" }));
      const mumbaiNfts = (responseMumbai.data.result as TokenAPISimple[]).map(nft => ({ ...nft, type: "POLYGON" }));
      const bscNfts = (responseBsc.data.result as TokenAPISimple[]).map(nft => ({ ...nft, type: "BSC" }));
      const combinedResults = [...goerliNfts, ...mumbaiNfts, ...bscNfts];

      const metadataResults = combinedResults.filter((n: any) => n.metadata);
      const tokens: TokenAPISimple[] = metadataResults.map((data: any) => {
        let image = JSON.parse(data.metadata ?? "").image ?? "";

        if (image.startsWith("ipfs://")) {
          const pp = image.split("/");
          const cid = pp.slice(2, 3)[0];
          const filename = pp.slice(3).join("/");
          const hostname = "https://ipfs.io/ipfs/";
          image = hostname + cid + (filename ? "/" + filename : "");
          console.log(image, "=========");
        }

        return {
          mintId: data.token_id,
          title: data.name,
          image: image,
          listedForSale: false,
          collectionId: data.token_address,
          type: data.type,
        };
      });

      console.log("nftData------>", tokens);
      //@ts-ignore
      setNftData(tokens);
      return metadataResults;
    } catch (error) {
      console.error(error);
    }
  };
  const burningContract = new ethers.Contract(burningContractAddress, BurningABI, Signer);
  const bulkTransferContract = new ethers.Contract("0x0000000000c2d145a2526bD8C716263bFeBe1A72", BulkABI, Signer)
  const burnNFT = async () => {
    try {
      console.log("------------1")
      setLoad(true);
      for (let i = 0; i < selectedNfts.length; i++) {
        const nftContract = new ethers.Contract(selectedTokenAddress[i], ERC721ABI, Signer);
        const approve = await nftContract.isApprovedForAll(account, burningContract.address);
        if (!approve) {
          const tx = await nftContract.setApprovalForAll(burningContract.address, true);
          await tx.wait();
        }
        console.log("Selected Account : =======", account, selectedTokenId)
        // const tx = await nftContract.transferFrom(account, "0x000000000000000000000000000000000000dEaD", selectedTokenId[i]);
        // console.log(tx, "werwer")
        // tx.wait();
        // const resolvedAddress = await tx.hash;
        // await addtxData(resolvedAddress);
        await addData(selectedImage[i]);
      }
      const tx = await burningContract.burning(selectedTokenAddress, selectedTokenId);
      // const tx = await bulkTransferContract.bulkTransfer(
      //   [
      //     [
      //       [[2, selectedTokenAddress[0], selectedTokenId[0], 1], [2, selectedTokenAddress[1], selectedTokenId[1], 1]],
      //       "0x000000000000000000000000000000000000dEaD",
      //       true
      //     ]
      //   ],
      //   "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
      //   {
      //     gasLimit: 180000
      //   }
      // );
      await tx.wait()
      const resolvedAddress = await tx.hash;
      await addtxData(resolvedAddress);
      console.log(tx.hash)
      console.log("------------3")

      setLoad(false);
    } catch (error) {
      console.log(error)
      setLoad(false);
    }

    // try {
    //   setLoad(true);
    //   try {
    //     const tx = await nftContract.transferFrom(account, "0x000000000000000000000000000000000000dEaD", tokenId);
    //     await tx.wait();
    //     const resolvedAddress = await tx.hash;
    //     console.log(resolvedAddress, "--------------------------------");
    //     await addtxData(resolvedAddress);
    //     await addData(image);
    //   } catch (e) {
    //     console.log(e);
    //     setLoad(true);
    //   } finally {
    //     setLoad(false);
    //   }

    // } catch (error) {
    //   console.log(error);
    //   setLoad(false);
    // }
  }
  useEffect(() => {
    if (!account) {
      setWalletConnected(false);
      return;
    }
    getNfts(account);
    setWalletConnected(true);
  }, [account])
  useEffect(() => {
    if (selectedNfts.length > 0) {
      setTitle("Select below the NFTs you want to burn")
    } else {
      setTitle("Select below the NFTs you want to burn")
    }
    console.log(selectedNfts)
  }, [selectedNfts])

  const [isOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  const [isModal, setIsModal] = useState(false);
  return (
    <main className="bg-black flex flex-row w-full h-[calc(100vh-180px)] mt-5 px-8">
      {walletConnected &&
        <div
          className="items-center text-white md:flex fixed top-4 left-[47%] md:text-[22px] text-[14px]"
        >
          <a href="https://hellains.com" target="_blank" rel="noreferrer">WEBSITE -</a>
          <a href="https://docs.hellains.com" target="_blank" rel="noreferrer">DOCS</a>
        </div>
      }
      {account && !isBurned &&
        <div className="flex md:flex-row flex-col justify-start bg-[#E95E5E73] w-full overflow-y-auto">

          <div className="md:w-3/4 w-full flex flex-wrap gap-2 p-5">
            {
              nftData && nftData.map((nft, key) => {
                const isSelected = selectedNfts.some(selectedNft =>
                  selectedNft.collectionId === nft.collectionId &&
                  selectedNft.mintId === nft.mintId &&
                  selectedNft.type === nft.type &&
                  selectedNft.image === nft.image
                );
                return (
                  <div
                    className={`hover:scale-125 flex flex-col w-[150px] h-[160px] justify-center items-center ${isSelected ? 'border-2 border-white' : ''}`}
                    onClick={() => {
                      const toggleSelectedNft = (nft: any) => {
                        const index = selectedNfts.findIndex(selectedNft =>
                          selectedNft.collectionId === nft.collectionId &&
                          selectedNft.mintId === nft.mintId &&
                          selectedNft.type === nft.type &&
                          selectedNft.image === nft.image
                        );
                        if (index === -1) {
                          setSelectedNfts([...selectedNfts, nft]);
                          setSelectedTokenAddress([...selectedTokenAddress, nft.collectionId])
                          setSelectedTokenId([...selectedTokenId, nft.mintId])
                          setSelectedImage([...selectedImage, nft.image])

                        } else {
                          const updatedSelectedNfts = [...selectedNfts];
                          const updatedSelectedTokenAddress = [...selectedTokenAddress];
                          const updatedSelectedTokenId = [...selectedTokenId];
                          const updatedSelectedImage = [...selectedImage];
                          updatedSelectedNfts.splice(index, 1);
                          updatedSelectedImage.splice(index, 1);
                          updatedSelectedTokenAddress.splice(index, 1);
                          updatedSelectedTokenId.splice(index, 1);
                          setSelectedNfts(updatedSelectedNfts);
                          setSelectedTokenAddress(updatedSelectedTokenAddress);
                          setSelectedTokenId(updatedSelectedTokenId);
                          setSelectedImage(updatedSelectedImage)
                        }
                      };
                      toggleSelectedNft({ image: nft.image, collectionId: nft.collectionId, mintId: nft.mintId, type: nft.type, title: nft.title });
                      console.log(selectedNfts)
                      console.log(selectedTokenAddress)
                      console.log(selectedImage)
                      console.log(selectedTokenId)
                    }}
                    key={key}
                  >
                    <img src={nft.image} alt="" className="w-[100px] h-[100px]" />
                    <p className="text-white">{nft.title}</p>
                    <p className="text-white">✔{nft.type}</p>
                  </div>
                );
              })
            }
          </div>
          <div className="md:w-1/4 w-full h-full bg-black flex flex-wrap p-5 justify-center border-white border-[2px]">
            {selectedNfts.length > 0 && !isLoad &&
              <div className="flex flex-col justify-center w-full">


                <div className="flex justify-center flex-col items-center w-full">
                  <p className="text-white text-[20px] text-center">
                    You have burned{` `}{length}{` `}NFT to date<br />
                  </p>
                  <p className="text-white text-[20px] text-center">Burning List
                    {isLoad && <p>........Loading</p>}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-5 w-full h-[400px] border-[2px] border-white pt-5 overflow-y-auto mx-auto">
                  {
                    selectedNfts && selectedNfts.map((nft, key) => (
                      <div className="relative" key={key}>
                        <button
                          className="absolute right-1 bg-white top-1 w-4 h-4 items-center text-center justify-center"
                          onClick={() => {
                            const toggleSelectedNft = (nft: {
                              image: string,
                              collectionId: string,
                              mintId: string,
                              type: string,
                              title: string
                            }) => {
                              const index = selectedNfts.findIndex(selectedNft =>
                                selectedNft.collectionId === nft.collectionId &&
                                selectedNft.mintId === nft.mintId &&
                                selectedNft.type === nft.type
                              );
                              if (index === -1) {
                                setSelectedNfts([...selectedNfts, nft]); // Add new data if not exists
                              } else {
                                const updatedSelectedNfts = [...selectedNfts];
                                updatedSelectedNfts.splice(index, 1); // Remove existing data if exists
                                setSelectedNfts(updatedSelectedNfts);
                              }
                            };
                            //@ts-ignore
                            toggleSelectedNft({ image: nft.image, collectionId: nft.collectionId, mintId: nft.mintId, type: nft.type, title: nft.title });
                            console.log(selectedNfts)
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                            <path fill="#000" d="M19.8 5.2c0.5-0.5 0.5-1.3 0-1.8s-1.3-0.5-1.8 0l-6.2 6.2-6.2-6.2c-0.5-0.5-1.3-0.5-1.8 0s-0.5 1.3 0 1.8l6.2 6.2-6.2 6.2c-0.5 0.5-0.5 1.3 0 1.8s1.3 0.5 1.8 0l6.2-6.2 6.2 6.2c0.5 0.5 1.3 0.5 1.8 0s0.5-1.3 0-1.8l-6.2-6.2z" />
                          </svg>
                        </button>
                        <img src={nft.image} alt="" className="w-[100px] h-[100px]" />
                        <div className="w-full justify-center">
                          <p className="text-white text-center">{nft.title}-{nft.mintId}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
                {isModal &&
                  <div className="w-full h-full fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-[#6b6969] bg-opacity-60 backdrop-opacity-50">
                    <div className="w-[400px] h-[200px] bg-black flex justify-between flex-col items-center px-5 rounded-md p-5">
                      <div className="flex flex-col mt-3">
                        <p className="text-[20px] text-white">Are you sure to proceed?</p>
                        <p className="text-[20px] text-white">This action is irreversible!</p>
                      </div>
                      <div className="flex">
                        <button className="bg-[#FF0707] rounded-lg text-white w-[132px] h-[33px] m-3"
                          onClick={
                            async () => {
                              setIsModal(false)
                              // const burnPromises: Promise<any>[] = [];
                              // selectedNfts.map(async (index) => {
                              //   try {
                              //     if (index.type === "bsc") await connect2();
                              //     else if (index.type === "mumbai") await connect1();
                              //     else if (index.type === "goerli") await connect();
                              //     burnPromises.push(burnNFT(index.mintId, index.collectionId, index.image));
                              //     // await addData(index.image);
                              //   } catch (error) {
                              //     //handle error of rejected promises
                              //     console.error(error);
                              //     //add more error handling here, like notifications to users, retrying the transaction etc.
                              //   }
                              // });
                              // await Promise.all(burnPromises);
                              await burnNFT();
                              console.log(length);
                              const snapshot = await getDocs(collection(db, "txdata"));
                              let cnt = 0;

                              snapshot.docs.forEach((index) => {
                                if (index.data()['account'] === account) {
                                  cnt++;
                                }
                              })
                              // Usage:
                              if (length === cnt) {
                                setIsBurned(false);
                                setIsModal(false)
                              } else {
                                setIsBurned(true);
                                setIsModal(false)
                              }
                            }}
                        >
                          Burn!
                        </button>
                        <button className="bg-[#3045fa] rounded-lg text-white w-[132px] h-[33px] m-3"
                          onClick={() => { setIsModal(false) }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                }
                <div className="w-full flex justify-center mt-2">
                  <button className="bg-[#FF0707] rounded-lg text-white w-[132px] h-[33px] m-3"
                    onClick={() => { setIsModal(true) }}
                  >
                    Burn!
                  </button>
                </div>
              </div>
            }
            {selectedNfts.length > 0 && isLoad &&
              <img src="/img/anim.gif" alt="" />
            }
          </div>
        </div>
      }
      {
        account && isBurned &&
        <div className="relative flex flex-col p-10 bg-[#E95E5E73] overflow-y-auto w-full justify-center items-center">
          <button
            className="bg-white p-5 rounded-full w-6 h-6 text-black absolute top-2 right-2 flex justify-center items-center hover:scale-125"
            onClick={() => { setIsBurned(false); setSelectedNfts([]); setImgUrl([]); setTx([]); router.reload(); }}>
            Home
          </button>
          <div className="w-full flex justify-center">

            <p className="text-black text-[20px] text-center justify-center flex flex-col">
              Burn Complete<br />
              <a href="https://twitter.com/hellainsnft" target="_blank" rel="noreferrer">HELL Incinerator by Hellians</a>
            </p>
          </div>

          <p className="text-black text-[20px] w-full justify-center flex flex-col items-center mt-10">
            Verify Transaction<br />
            {
              tx && tx.map((nft, key) =>
                <a key={key}
                  href={`https://polygonscan.com/tx/${nft}/`}
                  target="_blank" rel="noreferrer"
                >{nft}</a>
              )
            }
          </p>
          <p className="text-black font-bold text-[20px] w-full justify-center flex">
            Burned NFTs to date:
          </p>
          <div className="w-full flex flex-wrap gap-3 justify-center items-center">
            {
              imgUrl && imgUrl.map((nft, key) => {
                return (
                  <div
                    key={key}
                    className="relative">
                    <img src={nft} alt="" className="w-[100px] h-[100px]" key={key} />
                  </div>)
              })
            }
          </div>
        </div>
      }
      {
        !account &&
        <div className="bg-black w-full flex h-full items-center justify-center">
          <div className="items-center flex flex-col">
            <div
              className="items-center mt-10 w-full text-center text-white md:flex justify-center gap-10 text-[22px] "
            >
              <p>
                Connect your wallet to start
              </p>
            </div>
            <img src="/img/egg.png" alt="" className="w-[200px] h-[280px] cursor-pointer" onClick={() => {
              connect1();
            }} />

          </div>
        </div>
      }
    </main >
  );
};

export default Home;
