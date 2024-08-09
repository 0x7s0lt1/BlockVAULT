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

                    await contract['createVault']({from: address});

                    setStatusMessage("Deploying Contract...");

                    const vaultAddr = await contract['getVaultByOwner']({from: address});

                    vaultAddr.wait().then((receipt: any) => {

                        if(vault_addr != DEFAULT_ADDRESS){
                            setVault( new Contract( vaultAddr, VaultABI, signer ) );
                        }

                        setIsLoading(false);

                    })

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
                        To set up a vault, you'll need to deploy a smart contract that securely manages all your
                        secrets.
                        Please note that deploying the smart contract requires a small gas fee.
                        <br/><br/>
                        We recommend using the Polygon Mainnet, so ensure you have sufficient MATIC in your wallet to
                        cover the gas costs, which typically range from $0.04 to $0.08.
                        <br/><br/>
                        Once you're ready, simply click the button below and confirm the transaction.
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