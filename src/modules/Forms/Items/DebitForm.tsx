
import React, {FC, useEffect, useState} from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ABI as DebABI } from "@/common/contract/Items/DebitCardContract";
import { CHAINS } from "@/types/Utils";
import DebitCardType from "@/types/Items/DebitCardType";

type Props = {
    isCreate: boolean,
    vault: Contract | null,
    setListView: Function,
    item: DebitCardType|null
}
const DebitForm : FC<Props> = ({ isCreate, vault, setListView, item }) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [cardId, setCardId] = useState<string>('');
    const [nameOnCard, setNameOnCard] = useState<string>('');
    const [expireAt, setExpireAt] = useState<string>("");
    const [cvv, setCvv] = useState<string>("");
    const [error, setError] = useState<string|null>('');

    const handleNameChange = (e: any) => {
        setName(e.target.value);
    }
    const handleCardIdChange = (e: any) => {
        setCardId(e.target.value);
    }
    const handleNameOnCardChange = (e: any) => {
        setNameOnCard(e.target.value);
    }
    const handleExpireAtChange = (e: any) => {
        setExpireAt(e.target.value);
    }
    const handleCvvChange = (e: any) => {
        setCvv(e.target.value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        let _name = name.trim();
        let _cardId = cardId.trim();
        let _nameOnCard = nameOnCard.trim();
        let _expireAt = parseInt(expireAt);
        let _cvv = parseInt(cvv);

        if(!_name || !_cardId || !_nameOnCard || !_expireAt || !_cvv){
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        if(_name.length > 20){
            setError("Name must be less than 20 characters.");
            setIsLoading(false);
            return;
        }

        if(_cardId.length > 20){
            setError("Number must be less than 20 characters.");
            setIsLoading(false);
            return;
        }

        if(_nameOnCard.length > 40){
            setError("Name on card must be less than 40 characters.");
            setIsLoading(false);
            return;
        }

        if(_expireAt < 1000){
            setError("Expire at must be greater than 1000.");
            setIsLoading(false);
            return;
        }

        if(_expireAt > 9999){
            setError("Expire at must be less than 4 characters.");
            setIsLoading(false);
            return;
        }

        if(_cvv < 100){
            setError("Cvv must be greater than 3 characters.");
            setIsLoading(false);
            return;
        }

        if(_cvv > 999){
            setError("Cvv must be less than 4 characters.");
            setIsLoading(false);
            return;
        }

        if(!isCreate && item){

            if( _name == item.name && _cardId == item.card_id && _nameOnCard == item.name_on_card && _expireAt == Number(item.expire_at) && _cvv == Number(item.cvv) ){
                setError("No changes were made.");
                setIsLoading(false);
                return;
            }

        }

        await handleTransaction( _name, _cardId, _nameOnCard, _expireAt, _cvv);

    }

    useEffect(() => {

        if(!isCreate && item){
            setName(item.name);
            setCardId(item.card_id);
            setNameOnCard(item.name_on_card);
            setExpireAt(item.expire_at.toString());
            setCvv(item.cvv.toString());
        }else{
            setName("");
            setCardId("");
            setNameOnCard("");
            setExpireAt("");
            setCvv("");
        }

    }, [isCreate]);

    const handleTransaction = async ( _name: string, _cardId: string, nameOnCard: string, expireAt: number, cvv: number) => {

        try{

            if(address && isConnected && vault &&  walletProvider){

                if( CHAINS.get(chainId) !== undefined ){

                    let card;

                    if(isCreate){
                        card = await vault['createDebitCard']( _name, _cardId, nameOnCard, expireAt, cvv, {from: address} );
                    }else{

                       if (item){

                           const provider = new BrowserProvider(walletProvider);
                           const signer = await provider.getSigner();
                           const contract = new Contract(item.address, DebABI, signer);

                           card = await contract['setItem']( _name, _cardId, nameOnCard, expireAt, cvv, {from: address} );

                       }

                    }


                    card.wait().then( () => {

                        setName("");
                        setCardId("");
                        setNameOnCard("");
                        setExpireAt("");
                        setCvv("");

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
                    <input className={"form-input"} type={"text"} name={"card_id"} value={cardId}
                           onChange={handleCardIdChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>Name on card</h5>
                    <input className={"form-input"} type={"text"} name={"name_on_card"} value={nameOnCard}
                           onChange={handleNameOnCardChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>Expire at</h5>
                    <input className={"form-input"} type={"text"} name={"expire_at"} value={expireAt.toString()}
                           onChange={handleExpireAtChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>Cvv</h5>
                    <input className={"form-input"} type={"text"} name={"cvv"} value={cvv.toString()}
                           onChange={handleCvvChange}/>
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

export default DebitForm;