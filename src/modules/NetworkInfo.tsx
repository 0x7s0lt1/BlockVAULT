import { FC, useState, useEffect } from "react";
import { FuelPump, Hourglass } from 'react-bootstrap-icons';
import { BrowserProvider, formatUnits } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { CHAINS } from "@/types/Utils";
const NetworkInfo : FC = () => {


    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [gasPrice, setGasPrice] = useState<number>(0);
    const [pending, setPending] = useState<number>(0);

    const getGasPrice = async () => {

        if(walletProvider !== undefined){

            const provider = new BrowserProvider(walletProvider);
            const gasPrice = (await provider.getFeeData()).gasPrice ?? BigInt(0);

            const pendingTransactions = await provider.getBlock("pending");

            if(pendingTransactions){
                setPending(
                    pendingTransactions.transactions.length
                );
            }

            setGasPrice(
                Number(formatUnits(gasPrice, "gwei"))
            );
        }
    }

    useEffect(() => {

        (async ()=>{

            await getGasPrice();
            setInterval(async () => await getGasPrice(), 5000);

        })();

    }, []);

    return (
        <>
            <nav className={" slot-hover"}>
                {/*<Link className={"nav-item btn-hover"} to={"/organisations"}>*/}
                {/*    <Building size={26}/> &nbsp; Organisations*/}
                {/*</Link>*/}
                <span className="text-white"><FuelPump/> : <small>{gasPrice} {CHAINS.get(chainId)?.currency}</small> </span>
                <span className="text-white"> {pending} {"Pending transactions"} </span>
            </nav>
        </>
    )
}

export default NetworkInfo;