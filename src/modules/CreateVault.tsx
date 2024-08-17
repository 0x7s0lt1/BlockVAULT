"use client"

import { FC, useEffect, useState } from "react";
import { BrowserProvider, Contract, parseUnits } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider, useSwitchNetwork  } from '@web3modal/ethers/react';
import { ADDRESS as ManagerAddress, ABI as ManagerABI, chainIdAddressMap } from "@/common/contract/Manager/Contract";
import { ABI as VaultABI } from "@/common/contract/Vault/Contract";
import { DEFAULT_ADDRESS, CHAINS } from "@/types/Utils";

type Props = {
    manager: Contract | null,
    setVault: Function
}
const CreateVault : FC<Props> = ({ manager, setVault }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string|null>("Waiting confirmation...");
    const [error, setError] = useState<string|null>(null);

    const { walletProvider } = useWeb3ModalProvider();
    const { switchNetwork } = useSwitchNetwork();
    const { address, chainId, isConnected } = useWeb3ModalAccount();


    const handleClick = async () => {

        setIsLoading(true);

        try{

            if(address && isConnected && walletProvider && manager){

                if(CHAINS.get(chainId) !== undefined){

                    const provider = new BrowserProvider(walletProvider);
                    const signer = await provider.getSigner();

                    //const gasLimit = parseUnits("10", "gwei");
                    //const gasLimit = estimatedGas.mul(BigNumber.from(110)).div(BigNumber.from(100));
                    //const gasPrice = (await provider.getFeeData()).gasPrice;

                    const create = await manager['createVault']({from: address});

                    setStatusMessage("Deploying Contract...");

                    create.wait().then( async () => {

                        const vaultAddr = await manager['getVaultByOwner']({from: address});

                        if(vaultAddr != DEFAULT_ADDRESS){
                            setVault( new Contract( vaultAddr, VaultABI, signer ) );
                        }

                        setIsLoading(false);

                    }).catch( (err: any) =>{

                        console.log(err);
                        setError("Transaction failed or user rejected. Try again.");
                        setIsLoading(false);
                    })


                }else{

                    await switchNetwork(137);
                    setIsLoading(false);
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
                        <h3>Welcome to BlockVault.</h3>
                        <h6>The on-chain password and secret manager.</h6>
                        <br/>
                        To set up your secure vault, you will need to deploy a smart contract designed to manage your
                        secrets effectively. Please be aware that deploying this smart contract incurs a modest gas fee.
                        Additionally, each transaction that involves creating, editing, or deleting secrets will also
                        incur some gas costs.
                        <br/><br/>
                        {/*We recommend using the Polygon Mainnet for this process. Please ensure that your wallet contains enough MATIC to cover these gas costs, which typically range between $0.04 and $0.08.*/}
                        {/*<br/><br/>*/}

                        When you're ready to proceed, simply click the button below and confirm the transaction.
                        <br/>
                        <br/><br/>

                    </p>

                    <p className="card-err-msg">
                        {error && error}
                    </p>

                    <button className="crt-vlt-btn" onClick={handleClick}>
                        {
                            isLoading ?
                                <>
                                <span className="spinner-border" role="status">
                                </span>
                                    &nbsp; {statusMessage}
                                </>
                                : "DEPLOY VAULT"
                        }
                    </button>

                </div>
            </section>
        </>
    )
}

export default CreateVault;