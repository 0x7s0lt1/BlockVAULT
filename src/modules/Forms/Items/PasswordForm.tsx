
import React, {FC, useEffect, useState} from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ABI as PswABI } from "@/common/contract/Items/PasswordContract";
import { CHAINS } from "@/types/Utils";
import PasswordType from "@/types/Items/PasswordType";

type Props = {
    isCreate: boolean,
    vault: Contract | null,
    setListView: Function,
    item?: PasswordType|null
}
const PasswordForm : FC<Props> = ({isCreate, vault, setListView, item}) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


   const handleNameChange = (e: any) => {
        setName(e.target.value);
   }
    const handleUrlChange = (e: any) => {
        setUrl(e.target.value);
    }
    const handleUserNameChange = (e: any) => {
        setUserName(e.target.value);
    }
    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const _name = name.trim();
        const _url = url.trim();
        const _userName = userName.trim();
        const _password = password.trim();

        if(_name == "" || _url == "" || _userName == "" || _password == ""){
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        if(_name.length > 20){
            setError("Name must be less than 20 characters.");
            setIsLoading(false);
            return;
        }

        if(_url.length > 64){
            setError("URL must be less than 64 characters.");
            setIsLoading(false);
            return;
        }

        if(_userName.length > 64){
            setError("User Name must be less than 64 characters.");
            setIsLoading(false);
            return;
        }

        if(_password.length > 64){
            setError("Password must be less than 64 characters.");
            setIsLoading(false);
            return;
        }

        if(!isCreate && item){

            if(_name == item.name && _url == item.url && _userName == item.user_name && _password == item.password){
                setError("No changes were made.");
                setIsLoading(false);
                return;
            }

        }

        await handleTransaction( _name, _url, _userName, _password );

    }

    useEffect(() => {

        if(!isCreate && item){
            setName(item.name);
            setUrl(item.url);
            setUserName(item.user_name);
            setPassword(item.password);
        }else{
            setName("");
            setUrl("");
            setUserName("");
            setPassword("");
        }

    }, [isCreate]);

    const handleTransaction = async ( _name: string, _url: string, _userName: string, _password: string ) => {

        try{
            if(address && isConnected){

                if( CHAINS.get(chainId) !== undefined ){

                    let card;

                    if(isCreate){
                        card = await vault['createPassword']( _name, _url, _userName, _password, {from: address} );
                    }else{

                        const provider = new BrowserProvider(walletProvider);
                        const signer = await provider.getSigner();
                        const contract = new Contract(item.address, PswABI, signer);

                        card = await contract['setItem']( _name, _url, _userName, _password, {from: address} );

                    }


                    card.wait().then( () => {

                        setName("");
                        setUrl("");
                        setUserName("");
                        setPassword("");
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
                    <h5 className={"form-label"}>Name</h5>
                    <input className={"form-input"} type={"text"} name={"name"} value={name}
                           onChange={handleNameChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>URL</h5>
                    <input className={"form-input"} type={"text"} name={"url"} value={url}
                           onChange={handleUrlChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>User Name</h5>
                    <input className={"form-input"} type={"text"} name={"user_name"} value={userName}
                           onChange={handleUserNameChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>Password</h5>
                    <input className={"form-input"} type={"text"} name={"password"} value={password}
                           onChange={handlePasswordChange}/>
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

export default PasswordForm;