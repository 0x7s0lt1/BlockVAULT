"use client"

import React, {FC, useEffect, useState} from "react";

import MainLayout from "@/common/layout/MainLayout";
import Meta from "@/common/layout/Meta";
import CreateVault from "@/modules/CreateVault";
import ConnectWallet from "@/modules/ConnectWallet";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider, useSwitchNetwork  } from '@web3modal/ethers/react';
import { CHAIN_ID_DEC, ADDRESS, ABI } from "@/common/contract/Manager/Contract";
import { ABI as VaultABI } from "@/common/contract/UserVault/Contract";
import { DEFAULT_ADDRESS } from "@/common/utils";
import { Routes, Route, Link } from "react-router-dom";
import VaultInfo from "@/modules/VaultInfo";
import Loyality from "@/pages/Items/Loyality";
import Debit from "@/pages/Items/Debit";
import Password from "@/pages/Items/Password";
import { Key, CreditCard, PostcardHeart } from 'react-bootstrap-icons';
import Deposit from "@/pages/Payable/Deposit";
import Withdraw from "@/pages/Payable/Withdraw";

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

            if(address && walletProvider && isConnected){

                const provider = new BrowserProvider(walletProvider);
                const signer = await provider.getSigner();
                const contract = new Contract(ADDRESS, ABI, signer);

                const vlt_addr = await contract['getVaultByOwner']({from: address});

                if(vlt_addr != DEFAULT_ADDRESS){
                    setVault(new Contract(vlt_addr, VaultABI, signer));
                }

                setConnected(true);

            }

        })();

    }, [address, walletProvider, isConnected]);

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
                            <nav className={"border-white slot-hover"}>
                                <Link className={"nav-item btn-hover"} to={"/password"} >
                                    <Key size={26}/> &nbsp; Password
                                </Link>
                                <Link className={"nav-item btn-hover"} to={"/debit"}>
                                    <CreditCard size={26}/> &nbsp; Debit Card
                                </Link>
                                <Link className={"nav-item btn-hover"} to={"/loyality/list"}>
                                    <PostcardHeart size={26}/> &nbsp; Loyality Card
                                </Link>
                            </nav>
                        </div>

                        <div className={"board slot-hover"}>
                            <Routes>
                                <Route  path="/deposit" element={<Deposit vault={vault}/>} ></Route>
                                <Route  path="/withdraw" element={<Withdraw vault={vault}/>} ></Route>

                                <Route index path="/loyality/:page" element={<Loyality vault={vault}/>} ></Route>
                                <Route path="/debit" element={<Debit vault={vault}/>} ></Route>
                                <Route path="/password" element={<Password vault={vault}/>} ></Route>
                            </Routes>
                        </div>
                    </>
                }

            </section>


        </MainLayout>
    )
}

export default Index;