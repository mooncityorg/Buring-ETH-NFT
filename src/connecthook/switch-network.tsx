// Goerli testnet wallet switch
const switchNetworkRequest = () =>
  (window as any).ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x5" }],
  });
// Goerli testnet wallet switch
const addNetworkRequest = () =>
  (window as any).ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x5",
        chainName: "Goerli Testnet",
        rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
        blockExplorerUrls: ["https://goerli.etherscan.io/"],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
      },
    ],
  });
// Goerli Mumbai mainnet switch
const switchNetworkRequest1 = () =>
  (window as any).ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x89" }],
  });
// Goerli Mumbai mainnet switch
const addNetworkRequest1 = () =>
  (window as any).ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x89",
        chainName: "Polygon Mainnet",
        rpcUrls: ["https://polygon.llamarpc.com"],
        blockExplorerUrls: ["https://polygonscan.com"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
      },
    ],
  });
// Goerli BSC mainnet switch
const switchNetworkRequest2 = () =>
  (window as any).ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x38" }],
  });
// Goerli BSC mainnet switch
const addNetworkRequest2 = () =>
  (window as any).ethereum.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: "0x38",
        chainName: "BSC Testnet",
        rpcUrls: ["https://bsc.blockpi.network/v1/rpc/public"],
        blockExplorerUrls: ["https://bscscan.com"],
        nativeCurrency: {
          name: "BNB",
          symbol: "BNB",
          decimals: 18,
        },
      },
    ],
  });

export const switchNetwork = async () => {
  if (window as any) {
    try {
      await switchNetworkRequest();
    } catch (error) {
      if ((error as any).code === 4902) {
        try {
          await addNetworkRequest();
          await switchNetworkRequest();
        } catch (addError) {
          console.log(error);
        }
      }
      console.log(error);
    }
  }
};
export const switchNetwork1 = async () => {
  if (window as any) {
    try {
      await switchNetworkRequest1();
    } catch (error) {
      if ((error as any).code === 4902) {
        try {
          await addNetworkRequest1();
          await switchNetworkRequest1();
        } catch (addError) {
          console.log(error);
        }
      }
      console.log(error);
    }
  }
};

export const switchNetwork2 = async () => {
  if (window as any) {
    try {
      await switchNetworkRequest2();
    } catch (error) {
      if ((error as any).code === 4902) {
        try {
          await addNetworkRequest2();
          await switchNetworkRequest2();
        } catch (addError) {
          console.log(error);
        }
      }
      console.log(error);
    }
  }
};
