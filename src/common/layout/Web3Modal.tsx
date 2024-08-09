"use client"

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'abd13b22d4736ee28252107e46448d6b'

// 2. Set chains
const mainnet = {
    chainId: 137,
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-rpc.com'
}

// 3. Create modal
const metadata = {
    name: 'BlockVault',
    description: 'OnChain password manager',
    url: '',
    icons: ['']
}

createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: [mainnet],
    projectId
})

export function Web3ModalProvider() {
    return <></>;
}