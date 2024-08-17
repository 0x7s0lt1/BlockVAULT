
import React, {FC, useEffect, useState} from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { CHAINS } from "@/types/Utils";
import AddressShare from "@/modules/Items/AddressShare";

type Props = {
    isSearch: boolean,
    searchResults: typeof AddressShare[],
    sharedWith: Array<string>,
    handleDeleteShare: Function,
    vault: Contract | null
}
const ShareList : FC<Props> = ({
                                   isSearch,
                                   searchResults,
                                   sharedWith,
                                   handleDeleteShare,
                                   vault
                                  }) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [listIsLoading, setListIsLoading] = useState(true);
    const [addressesMap, setAddressesMap] = useState<any>();



    const fetchAddresses = async () => {

        setAddressesMap(<span className={"empty-label"}>Not shared with anyone yet</span>);

        try {

            if (address && isConnected && vault && walletProvider){

                if( CHAINS.get(chainId) !== undefined && sharedWith.length > 0 ){

                    setAddressesMap(
                        sharedWith.map( (item: string) => <AddressShare _address={item} handleDeleteShare={handleDeleteShare} vault={vault} /> )
                    );

                }

            }

        }catch (e) {
            console.log(e);
        }finally {
            setListIsLoading(false);
        }

    }


    useEffect(() => {

        (async()=> {
            await fetchAddresses();
        })();

    }, [sharedWith]);

    useEffect(() => {

        (async()=> {
            await fetchAddresses();
        })();

    }, [address, chainId, isConnected]);

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
                            { isSearch && searchResults }
                            { !isSearch && addressesMap }
                        </>
                }

            </div>

        </>
    )
}

export default ShareList;