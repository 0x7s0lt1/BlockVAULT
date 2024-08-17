
import { FC, useEffect, useState } from "react";
import { BrowserProvider, Contract, formatEther, Signer } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ABI as DebABI } from "@/common/contract/Items/DebitCardContract";
import { ABI as VaultABI } from "@/common/contract/Vault/Contract";
import { CHAINS, getUserBalance } from "@/types/Utils";
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

    let provider : BrowserProvider;
    let signer : Signer;
    (async()=>{
        if(walletProvider){
            provider = new BrowserProvider(walletProvider);
            signer = await provider.getSigner();
        }
    })();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [cardId, setCardId] = useState<string>('');
    const [nameOnCard, setNameOnCard] = useState<string>('');
    const [expireAt, setExpireAt] = useState<string>("");
    const [cvv, setCvv] = useState<string>("");
    const [error, setError] = useState<string|null>('');
    const [gasFee, setGasFee] = useState<any>(0);

    const handleNameChange = async (e: any) => {
        setName(e.target.value);
        await estimatedGas(
            name,
            cardId,
            nameOnCard,
            isNaN(parseInt(expireAt)) ? 0 : parseInt(expireAt),
            isNaN(parseInt(cvv)) ? 0 : parseInt(cvv)
        );

    }
    const handleCardIdChange = async (e: any) => {
        setCardId(e.target.value);
        await estimatedGas(
            name,
            cardId,
            nameOnCard,
            isNaN(parseInt(expireAt)) ? 0 : parseInt(expireAt),
            isNaN(parseInt(cvv)) ? 0 : parseInt(cvv)
        );
    }
    const handleNameOnCardChange = async(e: any) => {
        setNameOnCard(e.target.value);
        await estimatedGas(
            name,
            cardId,
            nameOnCard,
            isNaN(parseInt(expireAt)) ? 0 : parseInt(expireAt),
            isNaN(parseInt(cvv)) ? 0 : parseInt(cvv)
        );
    }
    const handleExpireAtChange = async (e: any) => {
        setExpireAt(e.target.value);
        await estimatedGas(
            name,
            cardId,
            nameOnCard,
            isNaN(parseInt(expireAt)) ? 0 : parseInt(expireAt),
            isNaN(parseInt(cvv)) ? 0 : parseInt(cvv)
        );
    }
    const handleCvvChange = async (e: any) => {
        setCvv(e.target.value);
        await estimatedGas(
            name,
            cardId,
            nameOnCard,
            isNaN(parseInt(expireAt)) ? 0 : parseInt(expireAt),
            isNaN(parseInt(cvv)) ? 0 : parseInt(cvv)
        );
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        let _name = name.trim();
        let _cardId = cardId.trim();
        let _nameOnCard = nameOnCard.trim();
        let _expireAt = isNaN(parseInt(expireAt)) ? 0 : parseInt(expireAt);
        let _cvv = isNaN(parseInt(cvv)) ? 0 : parseInt(cvv);

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

        const _balance = await getUserBalance(address, provider);
        await estimatedGas( _name, _cardId, _nameOnCard, _expireAt, _cvv);

        if(gasFee >= _balance){
            setError("Insufficient balance to pay gas fee.");
            setIsLoading(false);
            return;
        }

        await handleTransaction( _name, _cardId, _nameOnCard, _expireAt, _cvv);

    }

    const estimatedGas = async (..._args: any) => {
        try{
            if(address && isConnected && provider && vault){

                const contractAddress = isCreate ? vault.target : item?.address;
                if (!contractAddress) {
                    throw new Error("Contract address is not defined.");
                }

                const contractABI = isCreate ? VaultABI : DebABI;
                const contract: Contract = new Contract(contractAddress, contractABI, signer);
                const method = isCreate ? contract.createDebitCard : contract.setItem;

                if(method){

                    const gasEstimate = await method.estimateGas( ..._args, { from: address }) ?? BigInt(0);
                    const gasPrice = (await provider.getFeeData()).gasPrice ?? BigInt(0);

                    const totalCostWei= BigInt.asUintN(64,gasPrice) * BigInt.asUintN(64,gasEstimate);

                    const totalCostEther = formatEther(totalCostWei);

                    setGasFee(
                        parseFloat(totalCostEther)
                    );

                }

            }
        }catch (e) {
            console.log(e);
        }

    }

    useEffect(() => {
        ((async () => {
            setGasFee(
                await estimatedGas(
                    name,
                    cardId,
                    nameOnCard,
                    isNaN(parseInt(expireAt)) ? 0 : parseInt(expireAt),
                    isNaN(parseInt(cvv)) ? 0 : parseInt(cvv)
                )
            )
        }))();
    }, [address, chainId, isConnected]);

    useEffect(() => {

        if(!isCreate && item){
            setName(item.name);
            setCardId(item.card_id);
            setNameOnCard(item.name_on_card);
            setExpireAt(item.expire_at.toString());
            setCvv(item.cvv.toString());
            setGasFee(0);
        }else{
            setName("");
            setCardId("");
            setNameOnCard("");
            setExpireAt("");
            setCvv("");
            setGasFee(0);
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