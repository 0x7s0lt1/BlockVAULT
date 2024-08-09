
import { FC, useState } from "react";
import { Contract, parseEther } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { POLYGON_CHAIN_ID_DEC } from "@/types/Utils";

type Props = {
    fetchBalance: Function,
    vault: Contract | null
}
const WithdrawForm : FC<Props> = ({ fetchBalance, vault }) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState<number|"">("");
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

        if(_amount < 0){
            setError("Amount must be greater than 0.");
            setIsLoading(false);
            return;
        }

        await handleTransaction( _amount );

    }


    const handleTransaction = async ( _amount: number ) => {

        try{
            if(address && isConnected){

                if(chainId == POLYGON_CHAIN_ID_DEC){

                    _amount = parseEther( _amount.toString() );

                    const withdraw = await vault['withdraw']( _amount, {from: address} );


                    withdraw.wait().then( async () => {

                        await fetchBalance();
                        //TODO: send back to main menu

                        setAmount("");
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
                    <h5 className={"form-label"}>Amount (MATIC)</h5>
                    <input className={"form-input"} type={"text"} name={"amount"} value={amount}
                           onChange={handleAmountChange}/>
                </div>

                {/*//TODO: max button*/}

                <div className={"form-footer"}>
                    <p className={"form-error"}>
                        {error}
                    </p>
                    <button onClick={handleSubmit} disabled={isLoading} className={"btn-hover btn-circle submit-btn"}>
                        {isLoading ?
                            <>
                                <span className="spinner-border text-light" role="status"></span>
                                &nbsp; {"Receiving..."}
                            </>
                            :
                            <>
                                {"Withdraw"}
                            </>
                        }
                    </button>
                </div>

            </div>
        </>
    )
}

export default WithdrawForm;