import { Signer, verifyMessage } from "ethers";
import ChainMetaType from "@/types/ChainMetaType";

export const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

export const CHAINS: Map<number, ChainMetaType> = new Map<number, ChainMetaType>([
    // [1, {
    //     chainId: 1,
    //     name: "Ethereum",
    //     currency: "ETH",
    //     explorerUrl: "https://etherscan.io",
    //     rpcUrls: "https://rpc.flashbots.net/fast"
    // }],
    [137, {
        chainId: 137,
        name: "Polygon",
        currency: "MATIC",
        explorerUrl: "https://polygonscan.com",
        rpcUrls: "https://polygon-rpc.com"
    }],
    [11155111, {
        chainId: 11155111,
        name: "Sepolia",
        currency: "SepoliaETH",
        explorerUrl: "https://sepolia.etherscan.io",
        rpcUrls: "https://rpc.sepolia.org"
    }],
    [8453, {
        chainId: 8453,
        name: "Base",
        currency: "ETH",
        explorerUrl: "https://basescan.org/",
        rpcUrls: "https://mainnet.base.org"
    }],
    [43114, {
        chainId: 43114,
        name: "Avalanche",
        currency: "AVAX",
        explorerUrl: "https://snowtrace.io",
        rpcUrls: "https://api.avax.network/ext/bc/C/rpc"
    }],
    // [42161, {
    //     chainId: 42161,
    //     name: "Arbitrum",
    //     currency: "ETH",
    //     explorerUrl: "https://arbiscan.io",
    //     rpcUrls: "https://arb1.arbitrum.io/rpc"
    // }],
    // [10, {
    //     chainId: 10,
    //     name: "Optimism",
    //     currency: "OP",
    //     explorerUrl: "https://optimistic.etherscan.io",
    //     rpcUrls: "https://mainnet.optimism.io"
    // }]

]);

export const maskCaracters = (str: string) => {
    return str.slice(0, 4) + "***" + str.slice(str.length - 4, str.length);
}

export const hasValidSignature = async (address: string, signer: Signer) => {
    return new Promise(async (resolve,reject)=>{

        try{

            const message = "Please sign this message to unlock the secret. - " + Date.now();
            const signature = await signer.signMessage(message);

            const recoveredAddress = await verifyMessage(message, signature);

            if(address == recoveredAddress){
                resolve(true);
            }else{
                reject(false);
            }

        }catch (e){
            console.log(e);
            reject(e);
        }

    })

}
