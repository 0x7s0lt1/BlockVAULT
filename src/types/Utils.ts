import { Signer, verifyMessage, formatEther } from "ethers";
import ChainMetaType from "@/types/ChainMetaType";
import { ItemType } from "@/types/ItemType";
import { ABI as LoyABI } from "@/common/contract/Items/LoyalityCardContract";
import { ABI as PwsABI } from "@/common/contract/Items/PasswordContract";
import { ABI as DebABI } from "@/common/contract/Items/DebitCardContract";
import CryptoJS from "crypto-js/core";
import  AES from "crypto-js/aes";

export const DEFAULT_ADDRESS = "0x0000000000000000000000000000000000000000";

export const FILE_SIGN_MESSAGE = "Sign message to encrypt or decrypt file";
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
    // [59144, {
    //     chainId: 59144,
    //     name: "Linea",
    //     currency: "ETH",
    //     explorerUrl: "https://lineascan.build/",
    //     rpcUrl: "https://rpc.linea.build"
    // }],
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

export const maskCaracters = (str: string, long: number = 4) => {
    return str.slice(0, long) + "***" + str.slice(str.length - long, str.length);
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

export const encryptData = (data: string, key: string) => {
    return AES.encrypt(data, key).toString();
};

export const decryptData = (data: string, key: string) => {
    return AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}

export const downloadFile = (data: string, fileName: string, asBlob: boolean = false, contentType: string = "text/plain" ) => {

    return new Promise<void>(async (resolve, reject) => {

        try{

            const link = document.createElement('a');

            link.download = fileName;
            link.href = asBlob ?
                URL.createObjectURL( new Blob([data], { type: contentType })) :
                data;

            link.click();

            resolve();

        }catch (e){
            console.log(e);
            reject(e);
        }

    });

}

export const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop();
}

export const splitStringIntoChunks = (str: string, size: number) => {
    return new Promise( (resolve, reject) => {

        try{

            const chunks = [];
            let index = 0;

            while (index < str.length) {
                chunks.push(str.substring(index, index + size));
                index += size;
            }

            resolve(chunks);

        }catch (e){
            console.log(e);
            reject(e);
        }

    });
}

export const getBase64 = (file: File, asText: boolean = false) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        asText ? reader.readAsText(file) : reader.readAsDataURL(file);
    });
}