"use client"

import { FC, useEffect, useState } from "react";

import MainLayout from "@/common/layout/MainLayout";
import Meta from "@/common/layout/Meta";
import CreateVault from "@/modules/CreateVault";
import ConnectWallet from "@/modules/ConnectWallet";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider, useSwitchNetwork  } from '@web3modal/ethers/react';
import { ABI as ManagerABI, chainIdAddressMap } from "@/common/contract/Manager/Contract";
import { ABI as VaultABI } from "@/common/contract/Vault/Contract";
import { Routes, Route } from "react-router-dom";
import VaultInfo from "@/modules/VaultInfo";
import Loyality from "@/pages/Items/Loyality";
import Debit from "@/pages/Items/Debit";
import Password from "@/pages/Items/Password";
import Deposit from "@/pages/Payable/Deposit";
import Withdraw from "@/pages/Payable/Withdraw";
import ItemsNav from "@/modules/ItemsNav";
import { CHAINS, DEFAULT_ADDRESS } from "@/types/Utils";
import { VersionManagers, ABI as VersionManagerABI } from "@/common/contract/VersionManager/Contract";
// import NetworkInfo from "@/modules/NetworkInfo";
import Share from "@/pages/Share";

const Index : FC = () => {

    const { switchNetwork } = useSwitchNetwork();
    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [manager, setManager] = useState<Contract|null>(null);
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

    const fetchManager = async () => {

        const vmAddr = VersionManagers.get(chainId);

        if( CHAINS.get(chainId) != undefined && vmAddr != undefined && walletProvider ){

            const provider = new BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            const vsm = new Contract( vmAddr, VersionManagerABI, signer );

            const mngAddr = await vsm['getCurrentManager']({from: address});
            const mng = new Contract( mngAddr, ManagerABI, signer );

            setManager( mng );

        }else{
            await switchNetwork(11155111);
        }

    }

    const fetchVault = async () => {

        if( CHAINS.get(chainId) != undefined && walletProvider && manager){

            const provider = new BrowserProvider(walletProvider);
            const signer = await provider.getSigner();

            const vaultAddr = await manager['getVaultByOwner']({from: address});

            if(vaultAddr != DEFAULT_ADDRESS){
                setVault( new Contract( vaultAddr, VaultABI, signer ) );
            }else{
                setVault(null);
                setTicker("UNKNOWN");
            }

        }else{
            await switchNetwork(11155111);
        }

    }

    useEffect(() => {

        (async()=>{

            if(address && isConnected){
                await fetchManager();
            }

        })();

    }, [address]);

    useEffect(() => {
        (async ()=>{
            await fetchBalance();

            setIsLoading(false);
        })();
    }, [vault]);

    useEffect(() => {

        if(isConnected){

            (async ()=>{
                await fetchManager();
            })();

        }else{
            setVault(null);
        }

    }, [isConnected, chainId]);

    useEffect(() => {

        if(manager){

            (async ()=>{
                await fetchVault();
            })();

        }

    }, [manager]);

    useEffect(() => {

        (async ()=>{
            await fetchManager();
        })();

    }, []);

    return (
        <MainLayout>

            <Meta />

            {isLoading ?
                <>
                    <div className={"loader"}></div>
                </> :
                <>

                    {
                        !isConnected ? <ConnectWallet/> : !vault ? <><CreateVault manager={manager} setVault={setVault}/></> : <></>
                    }

                    <section className={"dash"}>

                        {
                            vault && isConnected &&
                            <>
                                <div className={"nav"}>
                                    <VaultInfo ticker={ticker} balance={balance} vault={vault}/>
                                    <ItemsNav/>
                                    {/*<NetworkInfo/>*/}
                                </div>
                                <div className={"board slot-hover"}>
                                    <Routes>

                                        <Route index path="/" element={<Password vault={vault}/>} ></Route>

                                        <Route path="/share/:item_type/:item_addr" element={<Share vault={vault}/>} ></Route>

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


                </>
            }

        </MainLayout>
    )
}

export default Index;