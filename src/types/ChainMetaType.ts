type ChainMetaType = {
    chainId: number
    name: string
    currency: string
    explorerUrl: string
    rpcUrls: string
}

export const isChainMetaType = (obj: any): obj is ChainMetaType => {
    return typeof obj.chainId === "number" && typeof obj.name === "string" && typeof obj.currency === "string" && typeof obj.explorerUrl === "string" && typeof obj.rpcUrls === "string";
}

export default ChainMetaType;