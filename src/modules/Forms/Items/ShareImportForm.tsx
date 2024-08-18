
import { FC, useEffect, useState } from "react";
import { BrowserProvider, Contract, formatEther, isAddress } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { CHAINS, DEFAULT_ADDRESS, getUserBalance, ItemTypeToABIMap } from "@/types/Utils";
import {ItemType, ItemTypeToReadableMap} from "@/types/ItemType";

type Props = {
    itemType: ItemType
    vault: Contract | null,
    setListView: Function
}
const ShareImportForm : FC<Props> = ({ itemType, vault, setListView }) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    let provider: BrowserProvider;
    let signer: any;
    (async()=>{
        if(walletProvider){
            provider = new BrowserProvider(walletProvider);
            signer = await provider.getSigner();
        }
    })();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [_itmAddress, setItmAddress] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [gasFee, setGasFee] = useState<any>(0);

    const handleItmAddressChange = async (e: any) => {
        setItmAddress(e.target.value);
        await estimatedGas( itemType, e.target.value );

    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const _addr = _itmAddress.trim();

        if(_addr ==""){
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        if( !isAddress(_addr) ){
            setError("Invalid address.");
            setIsLoading(false);
            return;
        }

        const _balance = await getUserBalance(address, provider);
        await estimatedGas( itemType, _addr );

        if(gasFee >= _balance){
            setError("Insufficient balance to pay gas fee.");
            setIsLoading(false);
            return;
        }

        await handleTransaction( itemType, _addr );

    }

    const estimatedGas = async ( _t:number, _a: string ) => {
        try{
            if(address && isConnected && provider && vault && isAddress(_a)){

                const gasEstimate = await vault.addSharedItem.estimateGas( _t, _a, { from: address }) ?? BigInt(0);
                const gasPrice = (await provider.getFeeData()).gasPrice ?? BigInt(0);

                const totalCostWei= BigInt.asUintN(64,gasPrice) * BigInt.asUintN(64,gasEstimate);

                const totalCostEther = formatEther(totalCostWei);

                setGasFee(
                    parseFloat(totalCostEther)
                );

            }
        }catch (e:any) {
            console.log(e);

            if( e.messge && e.message.includes("Exist")){
                setGasFee(0);
                setError("This address already imported.");
            }

        }

    }

    useEffect(() => {
        ((async () => {
            setGasFee(
                await estimatedGas(itemType, _itmAddress.trim())
            )
        }))();
    }, [address, chainId, isConnected]);


    const handleTransaction = async ( _itemType: number, _address: string ) => {

        try{
            if(address && isConnected && vault && walletProvider){

                if( CHAINS.get(chainId) !== undefined ){

                    let card;

                    const shared = await vault['addSharedItem']( _itemType, _address, {from: address});

                    shared.wait().then( () => {

                        setItmAddress("");
                        setError("");
                        setGasFee(0);

                        setListView();

                    });

                }

            }
        }catch (e) {
            setError("Transaction failed or user rejected. Try again.");
            console.log(e);
            setIsLoading(false);
        }

    }

    return (
        <>
            <div className={"form-wrapper"}>

                <div className={"form-slot"}>
                    <h5 className={"form-label"}> {ItemTypeToReadableMap.get(itemType) ?? ""} Address</h5>
                    <input className={"form-input"} type={"text"} name={"name"} value={_itmAddress}
                           placeholder={DEFAULT_ADDRESS}
                           onChange={handleItmAddressChange}/>
                </div>

                <p className={"form-info"}>
                    {
                        gasFee > 0 ? `${gasFee} ${CHAINS.get(chainId)?.currency}` : ""
                    }
                </p>
                <p className={"form-error"}>
                    {error}
                </p>

                <div className={"form-footer"}>
                    <button onClick={handleSubmit} disabled={isLoading} className={"btn-hover btn-circle submit-btn"}>
                        {isLoading ?
                            <>
                                <span className="spinner-border text-light" role="status"></span>
                                &nbsp; Importing...
                            </>
                            :
                            <>
                                Import
                            </>
                        }
                    </button>
                </div>

            </div>
        </>
    )
}

export default ShareImportForm;