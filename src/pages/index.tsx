"use client"

import { FC, useEffect, useState } from "react";

import MainLayout from "@/common/layout/MainLayout";
import Meta from "@/common/layout/Meta";
import CreateVault from "@/modules/CreateVault";
import ConnectWallet from "@/modules/ConnectWallet";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider, useSwitchNetwork  } from '@web3modal/ethers/react';
import { ADDRESS as ManagerAddress, ABI as ManagerABI } from "@/common/contract/Manager/Contract";
import { ABI as VaultABI } from "@/common/contract/UserVault/Contract";
import { Routes, Route } from "react-router-dom";
import VaultInfo from "@/modules/VaultInfo";
import Loyality from "@/pages/Items/Loyality";
import Debit from "@/pages/Items/Debit";
import Password from "@/pages/Items/Password";
import Deposit from "@/pages/Payable/Deposit";
import Withdraw from "@/pages/Payable/Withdraw";
import ItemsNav from "@/modules/ItemsNav";
import { DEFAULT_ADDRESS, POLYGON_CHAIN_ID_DEC } from "@/types/Utils";

const Index : FC = () => {

    const { switchNetwork } = useSwitchNetwork();
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [connected, setConnected] = useState(false);
    const [vault, setVault] = useState<Contract|null>(null);

    useEffect(() => {

        (async()=>{
            
            if(!address){
                setConnected(false);
            }

            if(address && isConnected){

                if(chainId == POLYGON_CHAIN_ID_DEC){

                    const provider = new BrowserProvider(walletProvider);
                    const signer = await provider.getSigner();
                    const contract = new Contract( ManagerAddress, ManagerABI, signer );

                    const vaultAddr = await contract['getVaultByOwner']({from: address});

                    if(vaultAddr != DEFAULT_ADDRESS){
                        setVault( new Contract( vaultAddr, VaultABI, signer ) );
                    }

                    setConnected(true);

                }

                //TODO: force polyon mainnet ?

            }

        })();

    }, [address, isConnected]);

    return (
        <MainLayout>

            <Meta />

            {
                !connected ? <ConnectWallet/> : !vault ? <><CreateVault setVault={setVault}/></> : <></>
            }

            <section className={"dash"}>

                {
                    vault && connected &&
                    <>
                        <div className={"nav"}>
                            <VaultInfo vault={vault}/>
                            <ItemsNav/>
                        </div>
                        <div className={"board slot-hover"}>
                            <Routes>
                                <Route  path="/deposit" element={<Deposit vault={vault}/>} ></Route>
                                <Route  path="/withdraw" element={<Withdraw vault={vault}/>} ></Route>

                                <Route index path="/loyality/:slug" element={<Loyality vault={vault}/>} ></Route>
                                <Route path="/debit/:slug" element={<Debit vault={vault}/>} ></Route>
                                <Route path="/password/:slug" element={<Password vault={vault}/>} ></Route>
                            </Routes>
                        </div>
                    </>
                }

            </section>

        </MainLayout>
    )
}

export default Index;