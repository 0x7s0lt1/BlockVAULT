
import React, {FC, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { Contract } from "ethers";
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import {CHAIN_ID_DEC} from "@/common/contract/UserVault/Contract";
import {ItemType} from "@/types/ItemType";
import LoyalityCardType from "@/types/Items/LoyalityCardType";
import LoyalityCard from "@/modules/Items/LoyalityCard";

type Props = {
    vault: Contract | null,
    setListView: Function
}
const LoyalityForm : FC<Props> = ({vault, setListView}) => {

    const navigate = useNavigate();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

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

        if(_number.length > 40){
            setError("Number must be less than 20 characters.");
            setIsLoading(false);
            return;
        }

        await handleDeploy(_name, _number);

    }

    const handleDeploy = async (_name: string, _number: string) => {

        try{
            if(address && isConnected){

                if(chainId == CHAIN_ID_DEC){

                    const card = await vault['createLoyalityCard']( _name, _number, {from: address} );

                    setName("");
                    setNumber("");
                    setError("");
                    setListView();

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

                <div className={"form-footer"}>
                    <p className={"form-error"}>
                        {error}
                    </p>
                    <button onClick={handleSubmit} disabled={isLoading} className={"btn-hover btn-circle submit-btn"}>
                        {isLoading ?
                            <>
                                <span className="spinner-border text-light" role="status"></span>
                                &nbsp; Creating...
                            </>
                            :
                            <>
                                Create
                            </>
                        }
                    </button>
                </div>

            </div>
        </>
    )
}

export default LoyalityForm;