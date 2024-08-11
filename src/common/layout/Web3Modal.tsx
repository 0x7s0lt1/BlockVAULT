"use client"

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { CHAINS } from "@/types/Utils";

const projectId = 'abd13b22d4736ee28252107e46448d6b'

const metadata = {
    name: 'BlockVault',
    description: 'OnChain password manager',
    url: '',
    icons: ['']
}

createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: Array.from(CHAINS.values()),
    projectId
})

export function Web3ModalProvider() {
    return <></>;
}