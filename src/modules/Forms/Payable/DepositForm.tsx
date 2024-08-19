
import { FC, useState, useEffect } from "react";
import { BrowserProvider, Contract, parseEther, formatEther, Signer } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { CHAINS, getUserBalance } from "@/types/Utils";

type Props = {
    fetchBalance: Function
    vault: Contract | null
}
const DepositForm : FC<Props> = ({ fetchBalance, vault }) => {

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

    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState<string>("");
    const [userBalance, setUserBalance] = useState<number>();
    const [error, setError] = useState<string>();


    const handleAmountChange = (e: any) => {
        setAmount(e.target.value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const _amount = parseFloat(amount);

        if(isNaN(_amount)){
            setError("Please enter a valid amount.");
            setIsLoading(false);
            return;
        }

        if(_amount <= 0){
            setError("Amount must be greater than 0.");
            setIsLoading(false);
            return;
        }

        if(userBalance && userBalance < _amount){
            setError(
                userBalance <= 0 ? "No balance to deposit." :
                    `Maximum amount available to deposit is ${userBalance} ${CHAINS.get(chainId)?.currency}.`
            );
            setIsLoading(false);
            return;
        }

        await handleTransaction( _amount );

    }

    const handleBalanceClick = async () => {
        if(userBalance){
            setAmount((userBalance - 0.00000001 > 0 ? userBalance - 0.00000001 : 0).toString());
        }
    }
    
    useEffect(() => {
        (async()=>{

            if(walletProvider){

                const balance = await getUserBalance(address, provider);

                setUserBalance(balance);

            }

        })();
    }, [chainId]);


    const handleTransaction = async ( _amount: number|BigInt ) => {

        try{
            if(address && isConnected && vault){

                if( CHAINS.get(chainId) !== undefined ){

                    _amount = parseEther( _amount.toString() );

                    const deposit = await vault['deposit']({from: address, value: _amount} );


                    deposit.wait().then( async () => {

                        await fetchBalance();

                        setAmount("");
                        setError(undefined);
                        setIsLoading(false);

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
                    <h5 className={"form-label"}>{`Amount (${CHAINS.get(chainId)?.currency})`}</h5>
                    <input className={"form-input"} type={"text"} name={"amount"} value={amount}
                           onChange={handleAmountChange}/>
                    <p className={"mt-2 mx-2 cursor-pointer"} onClick={handleBalanceClick}>{`Balance: ${userBalance}`}</p>
                    <p className={"form-error"}>
                        &nbsp;{error}
                    </p>
                </div>

                <div className={"form-footer"}>
                    <button onClick={handleSubmit} disabled={isLoading} className={"btn-hover btn-circle submit-btn"}>
                        {isLoading ?
                            <>
                                <span className="spinner-border text-light" role="status"></span>
                                &nbsp; {"Sending..."}
                            </>
                            :
                            <>
                                {"Deposit"}
                            </>
                        }
                    </button>
                </div>

            </div>
        </>
    )
}

export default DepositForm;