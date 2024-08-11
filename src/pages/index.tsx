"use client"

import { FC, useEffect, useState } from "react";

import MainLayout from "@/common/layout/MainLayout";
import Meta from "@/common/layout/Meta";
import CreateVault from "@/modules/CreateVault";
import ConnectWallet from "@/modules/ConnectWallet";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider, useSwitchNetwork  } from '@web3modal/ethers/react';
import { ABI as ManagerABI, chainIdAddressMap } from "@/common/contract/Manager/Contract";
import { ABI as VaultABI } from "@/common/contract/UserVault/Contract";
import { Routes, Route } from "react-router-dom";
import VaultInfo from "@/modules/VaultInfo";
import Loyality from "@/pages/Items/Loyality";
import Debit from "@/pages/Items/Debit";
import Password from "@/pages/Items/Password";
import Deposit from "@/pages/Payable/Deposit";
import Withdraw from "@/pages/Payable/Withdraw";
import ItemsNav from "@/modules/ItemsNav";
import { CHAINS, DEFAULT_ADDRESS } from "@/types/Utils";

const Index : FC = () => {

    const { switchNetwork } = useSwitchNetwork();
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [vault, setVault] = useState<Contract|null>(null);
    const [ticker, setTicker] = useState<string>("UNKNOWN");
    const [balance, setBalance] = useState<number>(0);

    const fetchBalance = async () => {
        if(vault && isConnected){
           try{
               const _balance = await vault['getBalance']({from: address});
               setBalance( parseFloat(formatUnits(_balance, 'ether')) );
               setTicker( CHAINS.get(chainId)?.currency ?? "UNKNOWN" );
           }catch (e){
               console.log(e);
           }
        }
    }

    const fetchVault = async () => {

        if( CHAINS.get(chainId) != undefined && walletProvider ){

            const provider = new BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            const contract = new Contract( chainIdAddressMap.get(chainId) ?? "", ManagerABI, signer );

            const vaultAddr = await contract['getVaultByOwner']({from: address});

            if(vaultAddr != DEFAULT_ADDRESS){
                setVault( new Contract( vaultAddr, VaultABI, signer ) );
            }else{
                setVault(null);
                setTicker("UNKNOWN");
            }

        }else{
            await switchNetwork(137);
        }

    }

    useEffect(() => {

        (async()=>{

            if(address && isConnected){
                await fetchVault();
            }

        })();

    }, [address]);

    useEffect(() => {
        (async ()=>{
            await fetchBalance();
        })();
    }, [vault]);

    useEffect(() => {

        if(isConnected){

            (async ()=>{
                await fetchVault();
            })();

        }else{
            setVault(null);
        }

    }, [isConnected, chainId]);

    useEffect(() => {

        (async ()=>{
            await fetchVault();
        })();

    }, []);

    return (
        <MainLayout>

            <Meta />

            {
                !isConnected ? <ConnectWallet/> : !vault ? <><CreateVault setVault={setVault}/></> : <></>
            }

            <section className={"dash"}>

                {
                    vault && isConnected &&
                    <>
                        <div className={"nav"}>
                            <VaultInfo ticker={ticker} balance={balance} vault={vault}/>
                            <ItemsNav/>
                        </div>
                        <div className={"board slot-hover"}>
                            <Routes>

                                <Route index path="/" element={<Password vault={vault}/>} ></Route>

                                <Route  path="/deposit" element={<Deposit fetchBalance={fetchBalance} vault={vault}/>} ></Route>
                                <Route  path="/withdraw" element={<Withdraw balance={balance} fetchBalance={fetchBalance} vault={vault}/>} ></Route>

                                <Route path="/loyality" element={<Loyality vault={vault}/>} ></Route>
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