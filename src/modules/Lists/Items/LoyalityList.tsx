
import React, {FC, useEffect, useState} from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import {ABI, ADDRESS, CHAIN_ID_DEC} from "@/common/contract/UserVault/Contract";
import {ABI as LoyABI} from "@/common/contract/Items/LoyalityCardContract";
import {ItemType} from "@/types/ItemType";
import LoyalityCard from "@/modules/Items/LoyalityCard";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    vault: Contract | null
}
const LoyalityList : FC<Props> = ({vault}) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [listIsLoading, setListIsLoading] = useState(true);
    const [cardsMap, setCardsMap] = useState<any>(<span class={"empty-label"}>No Cards Yet</span>);

    useEffect(() => {

        (async()=> {

            if(address && isConnected){

                if(chainId == CHAIN_ID_DEC){

                    const addresses = await vault['getItem']( ItemType.LOYALITY_CARD, {from: address});

                    if(addresses.length > 0){

                        const provider = new BrowserProvider(walletProvider);
                        const signer = await provider.getSigner();

                        const cards: LoyalityCardType[] = [];

                        for (const _address of addresses) {

                            const contract = new Contract(_address, LoyABI, signer);
                            const card = await contract['expose']({from: address});

                            cards.push({
                                name: card[0],
                                number: card[1],
                                address: _address
                            } as LoyalityCardType );

                        }

                        console.log("Cards",cards);
                        setCardsMap(
                            cards.map( (item: LoyalityCardType) => <LoyalityCard item={item} vault={vault} /> )
                        );

                    }

                    setListIsLoading(false);

                }

            }

        })();

    }, []);
    
    return (
        <>
            <div className={"list-wrapper"}>

                {
                    listIsLoading ?
                        <>
                            <div className={"loading-wrapper"}>
                                <span className="spinner-border text-light" role="status"></span>
                            </div>
                        </> :
                        <>
                            { cardsMap }
                        </>
                }

            </div>
        </>
    )
}

export default LoyalityList;