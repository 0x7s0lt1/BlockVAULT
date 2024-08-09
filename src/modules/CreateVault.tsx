"use client"

import React, {FC, useEffect, useState} from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider, useSwitchNetwork  } from '@web3modal/ethers/react';
import { ADDRESS as ManagerAddress, ABI as ManagerABI } from "@/common/contract/Manager/Contract";
import { ABI as VaultABI } from "@/common/contract/UserVault/Contract";
import { POLYGON_CHAIN_ID_DEC, DEFAULT_ADDRESS } from "@/types/Utils";

type Props = {
    setVault: Function
}
const CreateVault : FC<Props> = ({setVault}) => {

    const [isLoading, setIsLoading] = useState<any>(false);
    const [statusMessage, setStatusMessage] = useState<any>("Waiting confirmation...");
    const [error, setError] = useState(null);

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();


    const handleClick = async () => {

        setIsLoading(true);

        try{

            if(address && isConnected){

                if(chainId == POLYGON_CHAIN_ID_DEC){

                    const provider = new BrowserProvider(walletProvider);
                    const signer = await provider.getSigner();
                    const contract = new Contract( ManagerAddress, ManagerABI, signer );

                    const create = await contract['createVault']({from: address});

                    setStatusMessage("Deploying Contract...");

                    create.wait().then( async () => {

                        const vaultAddr = await contract['getVaultByOwner']({from: address});

                        if(vaultAddr != DEFAULT_ADDRESS){
                            setVault( new Contract( vaultAddr, VaultABI, signer ) );
                        }

                        setIsLoading(false);

                    });


                }

                //TODO: force polyon mainnet ?

            }

        }catch (e) {
            setError("Transaction failed or user rejected. Try again.");
            console.log(e);
            setIsLoading(false);
        }
        
    }

    useEffect(() => {

    }, []);

    return (
        <>
            <section className="crt-vlt-wrapper">
                <div className="card">

                    <p className="card-text">
                        Welcome to our comprehensive on-chain password and secret manager.
                        <br/><br/>
                        To set up your secure vault, you will need to deploy a smart contract designed to manage your secrets effectively. Please be aware that deploying this smart contract incurs a modest gas fee. Additionally, each transaction that involves creating, editing, or deleting secrets will also incur some gas costs.
                        <br/><br/>
                        We recommend using the Polygon Mainnet for this process. Please ensure that your wallet contains enough MATIC to cover these gas costs, which typically range between $0.04 and $0.08.
                        <br/><br/>

                        When you're ready to proceed, simply click the button below and confirm the transaction.
                        <br/>
                        <br/><br/>

                    </p>

                    <button className="crt-vlt-btn" onClick={handleClick}>
                        {
                            isLoading ?
                                <>
                                <span className="spinner-border text-light" role="status">
                                </span>
                                    &nbsp; {statusMessage}
                                </>
                                : "CREATE VAULT"
                        }
                    </button>

                    <div className="card-err-msg">
                        {error && error}
                    </div>

                </div>
            </section>
        </>
    )
}

export default CreateVault;