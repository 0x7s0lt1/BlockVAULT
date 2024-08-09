"use client"

import React, {FC, useEffect, useState} from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider, useSwitchNetwork  } from '@web3modal/ethers/react';
import { CHAIN_ID_DEC, ADDRESS, ABI } from "@/common/contract/Manager/Contract";
import {DEFAULT_ADDRESS} from "@/common/utils";
import {ABI as VaultABI} from "@/common/contract/UserVault/Contract";

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

                if(chainId == CHAIN_ID_DEC){

                    const provider = new BrowserProvider(walletProvider);
                    const signer = await provider.getSigner();
                    const contract = new Contract(ADDRESS, ABI, signer);

                    await contract['createVault']({from: address});

                    setStatusMessage("Deploying Contract...");

                    const vlt_addr = await contract['getVaultByOwner']({from: address});

                    if(vault_addr != DEFAULT_ADDRESS){
                        setVault(new Contract(vault_addr, VaultABI, signer));
                    }

                    setIsLoading(false);

                }

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
                        To create a vault need to deploy a smart contract that manage all your secrets.
                        It cost some gas to deploy the smart contract.
                        Choose Polygon Mainnet and make sore you have enough MATIC to cover the gas. (0.04$ - 0.08$)
                        <br/><br/>
                        If everything is ok, click the button below and confirm the transaction.
                        <br/>

                    </p>
                    <button className="crt-vlt-btn" onClick={handleClick}>
                        {
                            isLoading ?
                                <>
                                <span className="spinner-border text-light" role="status">
                                </span>
                                    &nbsp; {statusMessage}
                                </>
                                : "⬆️ CREATE VAULT"
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