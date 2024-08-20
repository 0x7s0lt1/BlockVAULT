"use client"

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { CHAINS } from "@/types/Utils";

const projectId = 'abd13b22d4736ee28252107e46448d6b'

const metadata = {
    name: 'BlockVAULT',
    description: 'Decentralized secret manager',
    url: 'https://blkvlt.vercel.app',
    icons: ['https://blkvlt.vercel.app/img/og/og.webp']
}

createWeb3Modal({
    ethersConfig: defaultConfig({ metadata }),
    chains: Array.from( CHAINS.values() ),
    projectId
})

export function Web3ModalProvider() {
    return <></>;
}