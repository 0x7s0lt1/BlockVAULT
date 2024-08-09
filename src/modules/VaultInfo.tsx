
import React, {FC, useEffect, useState} from "react";
import {Contract, formatUnits} from "ethers";
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { Link } from "react-router-dom";

type Props = {
    vault: Contract | null
}
const VaultInfo : FC<Props> = ({ vault }) => {

    const [balance, setBalance] = useState(0);

    const { address, chainId, isConnected } = useWeb3ModalAccount();

    useEffect(() => {

        (async ()=>{

            if(vault !== null){
                const balance = await vault['getBalance']({from: address});
                setBalance( formatUnits(balance, 'ether') );
            }

        })();

    }, [vault]);

    return (
        <>
            <section className={"vlt-info border-white slot-hover"}>
                <span className="vlt-text">
                    <h1 className="value">
                        {balance} MATIC
                    </h1>
                </span>
                <span className="vlt-text">
                    <a className="value link-purple" href={`https://polygonscan.com/address/${vault.target}`}>
                        {vault.target}
                    </a>
                </span>

                <section className={"vlt-payable-wrapper"}>

                    <Link to={'/deposit'} className={"payable-btn btn-hover"}>Deposit</Link>
                    { balance > 0 ? <Link to={'/withdraw'} className={"payable-btn btn-hover"}>Withdraw</Link> : <></> }
                </section>

            </section>
        </>
    )
}

export default VaultInfo;