import { Signer, verifyMessage, formatEther } from "ethers";
import ChainMetaType from "@/types/ChainMetaType";
import { ItemType } from "@/types/ItemType";
import { ABI as LoyABI } from "@/common/contract/Items/LoyalityCardContract";
import { ABI as PwsABI } from "@/common/contract/Items/PasswordContract";
import { ABI as DebABI } from "@/common/contract/Items/DebitCardContract";

export const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

export const DEFAULT_SIGN_MESSAGE = "Sign this message to prove you own this wallet.";
export const SECRET_OPEN_SIGN_MESSAGE = "Please sign this message to unlock the secret.";

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
        rpcUrl: "https://polygon-rpc.com"
    }],
    [56, {
        chainId: 56,
        name: "Binance",
        currency: "BNB",
        explorerUrl: "https://bscscan.com",
        rpcUrl: "https://bsc-dataseed.binance.org/"
    }],
    [42161, {
        chainId: 42161,
        name: "Arbitrum",
        currency: "ETH",
        explorerUrl: "https://arbiscan.io",
        rpcUrl: "https://arb1.arbitrum.io/rpc"
    }],
    [11155111, {
        chainId: 11155111,
        name: "Sepolia",
        currency: "SepoliaETH",
        explorerUrl: "https://sepolia.etherscan.io",
        rpcUrl: "https://rpc.sepolia.org"
    }],
    // [8453, {
    //     chainId: 8453,
    //     name: "Base",
    //     currency: "ETH",
    //     explorerUrl: "https://basescan.org/",
    //     rpcUrl: "https://mainnet.base.org"
    // }],
    // [43114, {
    //     chainId: 43114,
    //     name: "Avalanche",
    //     currency: "AVAX",
    //     explorerUrl: "https://snowtrace.io",
    //     rpcUrl: "https://api.avax.network/ext/bc/C/rpc"
    // }],
    // [10, {
    //     chainId: 10,
    //     name: "Optimism",
    //     currency: "OP",
    //     explorerUrl: "https://optimistic.etherscan.io",
    //     rpcUrl: "https://mainnet.optimism.io"
    // }]

]);

export const ItemTypeToABIMap: Map<number, any> = new Map<number, any>([
    [ ItemType.LOYALITY_CARD,    LoyABI ],
    [ ItemType.DEBIT_CARD,       DebABI ],
    [ ItemType.PASSWORD,         PwsABI ]
]);

export const maskCaracters = (str: string) => {
    return str.slice(0, 4) + "***" + str.slice(str.length - 4, str.length);
};

export const hasValidSignature = async (address: string, signer: Signer, message: string = DEFAULT_SIGN_MESSAGE ) => {
    return new Promise(async (resolve,reject)=>{

        try{

            message += ( " - " + Date.now() );

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

export const getUserBalance = async (address: string, provider: any) => {
    return new Promise<any>(async (resolve,reject)=>{
        try{
            const balance = await provider.getBalance(address);
            resolve( Number( formatEther(balance) ) );
        }catch (e){
            console.log(e);
            reject(e);
        }
    })
}