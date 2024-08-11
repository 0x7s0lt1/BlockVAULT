
import { FC, useState } from "react";
import { Contract, parseEther, formatEther } from "ethers";
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { CHAINS } from "@/types/Utils";

type Props = {
    balance: BigInt,
    fetchBalance: Function,
    vault: Contract | null
}
const WithdrawForm : FC<Props> = ({ balance, fetchBalance, vault }) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const [isLoading, setIsLoading] = useState(false);
    const [amount, setAmount] = useState<string>("");
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

        if(Number(balance) < _amount){

            setError(
                Number(balance) <= 0 ? "No balance to withdraw." :
                `Maximum amount available to withdraw is ${balance} ${CHAINS.get(chainId)?.currency}.`
            );
            setIsLoading(false);
            return;
        }

        await handleTransaction( _amount );

    }


    const handleTransaction = async ( _amount: number|BigInt ) => {

        try{
            if(address && isConnected && vault){

                if(CHAINS.get(chainId) !== undefined){

                    _amount = parseEther( _amount.toString() );

                    const withdraw = await vault['withdraw']( _amount, {from: address} );


                    withdraw.wait().then( async () => {

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
                    <p className={"mt-2 mx-2"}>{`Contract Balance: ${balance}`}</p>
                    <p className={"form-error"}>
                        {error}
                    </p>
                </div>

                {/*//TODO: max button*/}

                <div className={"form-footer"}>
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