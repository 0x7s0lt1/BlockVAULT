
import { FC, useEffect, useState } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ABI as LoyABI } from "@/common/contract/Items/LoyalityCardContract";
import { ABI as VaultABI } from "@/common/contract/Vault/Contract";
import LoyalityCardType from "@/types/Items/LoyalityCardType";
import { CHAINS, getUserBalance } from "@/types/Utils";

type Props = {
    isCreate: boolean,
    vault: Contract | null,
    setListView: Function,
    item?: LoyalityCardType|null
}
const LoyalityForm : FC<Props> = ({isCreate, vault, setListView, item}) => {

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
    const [name, setName] = useState<string>('');
    const [number, setNumber] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [gasFee, setGasFee] = useState<any>(0);

    const handleNameChange = async (e: any) => {
        setName(e.target.value);
        await estimatedGas( e.target.value, number );

    }
    const handleNumberChange = async (e: any) => {
        setNumber(e.target.value);
        await estimatedGas( name, e.target.value );
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

        const _balance = await getUserBalance(address, provider);
        await estimatedGas( _name, _number );

        if(gasFee >= _balance){
            setError("Insufficient balance to pay gas fee.");
            setIsLoading(false);
            return;
        }

        await handleTransaction( _name, _number );

    }

    const estimatedGas = async (..._args: any) => {
        try{
            if(address && isConnected && provider && vault){

                const contractAddress = isCreate ? vault.target : item?.address;
                if (!contractAddress) {
                    throw new Error("Contract address is not defined.");
                }

                const contractABI = isCreate ? VaultABI : LoyABI;
                const contract: Contract = new Contract(contractAddress, contractABI, signer);
                const method = isCreate ? contract.createLoyalityCard : contract.setItem;

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
                await estimatedGas(name.trim(), number.trim())
            )
        }))();
    }, [address, chainId, isConnected]);

    useEffect(() => {

        if(!isCreate && item){
            setName(item.name);
            setNumber(item.number);
            setGasFee(0);
        }else{
            setName("");
            setNumber("");
            setGasFee(0);
        }

    }, [isCreate]);

    const handleTransaction = async ( _name: string, _number: string ) => {

        try{
            if(address && isConnected && vault && walletProvider){

                if( CHAINS.get(chainId) !== undefined ){

                    let card;

                    if(isCreate){
                        card = await vault['createLoyalityCard']( _name, _number, {from: address} );
                    }else{

                        if(item){

                            const contract = new Contract(item.address, LoyABI, signer);

                            card = await contract['setItem']( _name, _number, {from: address} );

                        }

                    }


                    card.wait().then( () => {

                        setName("");
                        setNumber("");
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
                    <h5 className={"form-label"}>Card Name</h5>
                    <input className={"form-input"} type={"text"} name={"name"} value={name}
                           placeholder={"John Doe"}
                           onChange={handleNameChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>Card Number</h5>
                    <input className={"form-input"} type={"text"} name={"number"} value={number}
                           placeholder={"1234567890"}
                           onChange={handleNumberChange}/>
                </div>

                <p className={"form-info"}>
                    {
                        gasFee > 0 ? `${gasFee} ${CHAINS.get(chainId)?.currency}` : ""
                    }
                </p>
                <p className={"form-error"}>
                    &nbsp;{error}
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