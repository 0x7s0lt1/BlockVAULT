
import { FC, useEffect, useState } from "react";
import { BrowserProvider, Contract, formatEther, Signer } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ABI as PswABI } from "@/common/contract/Items/PasswordContract";
import { ABI as VaultABI } from "@/common/contract/Vault/Contract";
import { CHAINS, getUserBalance } from "@/types/Utils";
import PasswordType from "@/types/Items/PasswordType";

type Props = {
    isCreate: boolean,
    vault: Contract | null,
    setListView: Function,
    item?: PasswordType|null
}
const PasswordForm : FC<Props> = ({ isCreate, vault, setListView, item }) => {

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
    const [url, setUrl] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string|null>('');
    const [gasFee, setGasFee] = useState<any>(0);


   const handleNameChange = async (e: any) => {
        setName(e.target.value);
        await estimatedGas( e.target.value, url, userName, password );
   }
    const handleUrlChange = async (e: any) => {
        setUrl(e.target.value);
        await estimatedGas( name, e.target.value, userName, password );
    }
    const handleUserNameChange = async (e: any) => {
        setUserName(e.target.value);
        await estimatedGas( name, url, e.target.value, password );
    }
    const handlePasswordChange = async (e: any) => {
        setPassword(e.target.value);
        await estimatedGas( name, url, userName, e.target.value );
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

        const _balance = await getUserBalance(address, provider);
        await estimatedGas( _name, _url, _userName, _password);

        if(gasFee >= _balance){
            setError("Insufficient balance to pay gas fee.");
            setIsLoading(false);
            return;
        }

        await handleTransaction( _name, _url, _userName, _password );

    }

    const estimatedGas = async (..._args: any) => {
        try{
            if(address && isConnected && provider && vault){

                const contractAddress = isCreate ? vault.target : item?.address;
                if (!contractAddress) {
                    throw new Error("Contract address is not defined.");
                }

                const contractABI = isCreate ? VaultABI : PswABI;
                const contract: Contract = new Contract(contractAddress, contractABI, signer);
                const method = isCreate ? contract.createPassword : contract.setItem;

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

        if(!isCreate && item){
            setName(item.name);
            setUrl(item.url);
            setUserName(item.user_name);
            setPassword(item.password);
            setGasFee(0);
        }else{
            setName("");
            setUrl("");
            setUserName("");
            setPassword("");
            setGasFee(0);
        }

    }, [isCreate]);

    const handleTransaction = async ( _name: string, _url: string, _userName: string, _password: string ) => {

        try{
            if(address && isConnected && vault && walletProvider){

                if( CHAINS.get(chainId) !== undefined ){

                    let card;

                    if(isCreate){
                        card = await vault['createPassword']( _name, _url, _userName, _password, {from: address} );
                    }else{

                       if(item){

                           const contract = new Contract(item.address, PswABI, signer);

                           card = await contract['setItem']( _name, _url, _userName, _password, {from: address} );
                           
                       }

                    }


                    card.wait().then( () => {

                        setName("");
                        setUrl("");
                        setUserName("");
                        setPassword("");
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
                    <h5 className={"form-label"}>Name</h5>
                    <input className={"form-input"} type={"text"} name={"name"} value={name}
                           placeholder={"Name of the password"}
                           onChange={handleNameChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>URL</h5>
                    <input className={"form-input"} type={"text"} name={"url"} value={url}
                           placeholder={"URL of the password"}
                           onChange={handleUrlChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>User Name</h5>
                    <input className={"form-input"} type={"text"} name={"user_name"} value={userName}
                           placeholder={"User name of the password"}
                           onChange={handleUserNameChange}/>
                </div>
                <div className={"form-slot"}>
                    <h5 className={"form-label"}>Password</h5>
                    <input className={"form-input"} type={"text"} name={"password"} value={password}
                           placeholder={"***************"}
                           onChange={handlePasswordChange}/>
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

export default PasswordForm;