
import React, {FC, useEffect, useState} from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ABI as LoyABI } from "@/common/contract/Items/LoyalityCardContract";
import LoyalityCardType from "@/types/Items/LoyalityCardType";
import { CHAINS } from "@/types/Utils";

type Props = {
    isCreate: boolean,
    vault: Contract | null,
    setListView: Function,
    item?: LoyalityCardType|null
}
const LoyalityForm : FC<Props> = ({isCreate, vault, setListView, item}) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [error, setError] = useState('');

    const handleNameChange = (e: any) => {
        setName(e.target.value);
    }
    const handleNumberChange = (e: any) => {
        setNumber(e.target.value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const _name = name.trim();
        const _number = number.trim();

        if(_name =="" || _number == ""){
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        if(_name.length > 20){
            setError("Name must be less than 20 characters.");
            setIsLoading(false);
            return;
        }

        if(_number.length > 20){
            setError("Number must be less than 20 characters.");
            setIsLoading(false);
            return;
        }

        if(!isCreate && item){

            if(_name == item.name && _number == item.number){
                setError("No changes were made.");
                setIsLoading(false);
                return;
            }

        }

        await handleTransaction( _name, _number );

    }

    useEffect(() => {

        if(!isCreate && item){
            setName(item.name);
            setNumber(item.number);
        }else{
            setName("");
            setNumber("");
        }

    }, [isCreate]);

    const handleTransaction = async ( _name: string, _number: string ) => {

        try{
            if(address && isConnected){

                if( CHAINS.get(chainId) !== undefined ){

                    let card;

                    if(isCreate){
                        card = await vault['createLoyalityCard']( _name, _number, {from: address} );
                    }else{

                        const provider = new BrowserProvider(walletProvider);
                        const signer = await provider.getSigner();
                        const contract = new Contract(item.address, LoyABI, signer);

                        card = await contract['setItem']( _name, _number, {from: address} );

                    }


                    card.wait().then( () => {

                        setName("");
                        setNumber("");
                        setError("");
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
                    <h5 className={"form-label"}>Card Name</h5>
                    <input className={"form-input"} type={"text"} name={"name"} value={name}
                           onChange={handleNameChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>Card Number</h5>
                    <input className={"form-input"} type={"text"} name={"number"} value={number}
                           onChange={handleNumberChange}/>
                </div>

                <p className={"form-error"}>
                    {error}
                </p>

                <div className={"form-footer"}>
                    <button onClick={handleSubmit} disabled={isLoading} className={"btn-hover btn-circle submit-btn"}>
                        {isLoading ?
                            <>
                                <span className="spinner-border text-light" role="status"></span>
                                &nbsp; {isCreate ? "Creating..." : "Updating..."}
                            </>
                            :
                            <>
                                {isCreate ? "Create" : "Update"}
                            </>
                        }
                    </button>
                </div>

            </div>
        </>
    )
}

export default LoyalityForm;