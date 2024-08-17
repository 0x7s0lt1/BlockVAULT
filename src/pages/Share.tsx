
import { FC, useState, useEffect } from "react";
// import { Arrow90degDown, ArrowReturnLeft } from 'react-bootstrap-icons';
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { BrowserProvider, Contract, isAddress } from "ethers";
import { useParams, Link } from 'react-router-dom';
import { CHAINS, hasValidSignature, ItemTypeToABIMap } from "@/types/Utils";
import { ItemType, ItemTypeToReadableMap } from "@/types/ItemType";
import ShareList from "@/modules/Lists/Items/ShareList";
import AddressShare from "@/modules/Items/AddressShare";

type Props = {
    vault: Contract | null
}
const Share : FC<Props> = ({ vault }) => {

    const { item_type, item_addr } = useParams();
    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ statusMessage, setStatusMessage ] = useState<string>("Adding...");
    const [ searchValue, setSearchValue ] = useState<string>("");
    const [ isSearch, setIsSearch ] = useState(false);
    const [ searchResults, setSearchResults ] = useState<typeof AddressShare[]>([]);
    const [ sharedWith, setSharedWith ] = useState<any[]>([]);
    const [ error, setError ] = useState<string>("");


    const fetchShare = async () => {

        try{

           if( isConnected && item_type && item_addr && walletProvider && BrowserProvider){

               const provider = new BrowserProvider(walletProvider);
               const signer = await provider.getSigner();
               const _item = new Contract( item_addr, ItemTypeToABIMap.get(Number(item_type)), signer );
               const _sharedWith = await _item['getSharedWith']({from: address});

               setSharedWith( _sharedWith );

           }


        }catch (e){
            console.log(e);
        }

    }


    const handleShare = async () => {
        
        setIsLoading(true);

        const _v: string = searchValue.trim();

        if( _v === "" ){
            setError("Please enter a valid address.");
            setIsLoading(false);
            return;
        }

        if(!isAddress(_v)){
            setError("Please enter a valid address.");
            setIsLoading(false);
            return;
        }

        if( isConnected && item_type && item_addr && walletProvider && BrowserProvider) {

            const provider = new BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            const _item = new Contract( item_addr, ItemTypeToABIMap.get(Number(item_type)), signer );
            const _sharedWith = await _item['shareWith']( _v, {from: address});

            _sharedWith.wait().then( async () => {

                await fetchShare();
                setSearchValue("");
                setIsSearch(false);
                setIsLoading(false);
                setError("");

            }).catch( (err: any) => {

                console.log(err);
                setError("Transaction failed or user rejected. Try again.");
                setIsLoading(false);

            });

        }

    }

    const handleDeleteShare = async ( _addr: string, onSuccess?: Function ) => {

        if( isConnected && item_type && item_addr && walletProvider && BrowserProvider) {

            const provider = new BrowserProvider(walletProvider);
            const signer = await provider.getSigner();
            const _item = new Contract( item_addr, ItemTypeToABIMap.get(Number(item_type)), signer );
            const _restrict = await _item['restictFrom']( _addr, {from: address});

            _restrict.wait().then( async () => {

                await fetchShare();
                setSearchValue("");
                setIsSearch(false);
                setError("");

            }).catch( (err: any) => {

                console.log(err);
                setError("Transaction failed or user rejected. Try again.");


            }).finally(()=>{

                if(typeof onSuccess == "function"){
                    onSuccess();
                }

            })

        }

        
        setIsLoading(false);

    }


    const isItemIncludes = (item: string, value: string) => {
        return item.toLowerCase().includes(value.toLowerCase());
    }

    const onSearchChange = (e: any) => {

        const _value = e.target.value.trim();
        setSearchValue( _value );

        if( _value === "" ){
            setSearchResults([]);
            setIsSearch(false);
            return;
        }

        setSearchResults(
            //@ts-ignore
            sharedWith.filter( (item: any) => isItemIncludes( item, _value ) )
                .map( (item: any) => <AddressShare _address={item} handleDeleteShare={handleDeleteShare} vault={vault} /> )
        )

        setIsSearch(true);
    }

    useEffect(() => {

        (async () => {
            await fetchShare();
        })();

    }, []);

    return (
        <>
            <div className={"page-header d-block"}>
                <div>
                    <div className={"share-header-wrapper"}>
                        <h2 className={"page-title"}>
                            {/*<Link className={"btn-hover btn-circle"} to={"/" + ItemTypeToReadableMap.get(Number(item_type))?.toLowerCase() }>*/}
                            {/*    <ArrowReturnLeft/>*/}
                            {/*</Link> &nbsp;*/}
                            Share
                        </h2>
                        <div className={"share-header"}>
                            <span className={"share-type"}> { ItemTypeToReadableMap.get(Number(item_type)) } </span>
                            <a target={"_blank"} className="value link-purple share-header-link"
                               href={`${CHAINS.get(chainId)?.explorerUrl ?? ""}/address/${item_addr}`}>
                                {`${item_addr}`}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"page-body border-white"}>

                <div className={"share-input-wrapper"}>
                    <div className={"share-src-wrapper"}>
                        <input className={"share-addr-inp"} name={"search"} onChange={onSearchChange} value={searchValue}
                               placeholder={"Search or add address"}/>
                        <button className={"btn-hover btn-circle"} onClick={handleShare}>
                            {
                                isLoading ?
                                    <>
                                <span className="spinner-border" role="status">
                                </span>
                                        &nbsp; {statusMessage}
                                    </>
                                    : "Add"
                            }
                        </button>
                    </div>
                    <p className={"share-error"}>{error}</p>
                </div>

                <ShareList isSearch={isSearch} searchResults={searchResults} sharedWith={sharedWith} handleDeleteShare={handleDeleteShare} vault={vault} />

            </div>
        </>
    )
}

export default Share;