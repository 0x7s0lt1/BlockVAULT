
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { Unlock, PencilSquare, Share, Trash, Link as LinkIcon } from 'react-bootstrap-icons';
import { Contract, BrowserProvider } from "ethers";
import DebitCardType from "@/types/Items/DebitCardType";
import { CHAINS, hasValidSignature, maskCaracters } from "@/types/Utils";
import { useWeb3ModalProvider, useWeb3ModalAccount  } from '@web3modal/ethers/react';
import { ItemType } from "@/types/ItemType";

type Props = {
    item: DebitCardType,
    setFormEditView: Function,
    setItem: Function,
    setIsModalVisible: Function,
    setIsDeleteModalVisible: Function,
    vault: Contract | null
}
const DebitCard: FC<Props> = ({ item, setFormEditView, setItem, setIsModalVisible, setIsDeleteModalVisible, vault }) => {

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

    const isSigned = async () => {

        try{

            if (!walletProvider) {
                return false;
            }

            const provider = new BrowserProvider(walletProvider);
            const signer = await provider.getSigner();

            const signatureIsValid = await hasValidSignature(address,signer);

            return signatureIsValid;

        }catch (e) {
            console.log(e);
            return false;
        }

    }
    const handleEdit = async ()=>{

        const signed = await isSigned();
        
        if(signed){
            setItem(item);
            setFormEditView();
        }
        
    }

    const handleShare = async ()=>{
        setItem(item);
        setIsModalVisible(true);
    }

    const handleOpen = async ()=>{

        const signed = await isSigned();
        
        if( signed ){
            setItem(item);
            setIsModalVisible(true);
        }

    }

    const handleDelete = async ()=>{

        const signed = await isSigned();
        
        if( signed ){
            setItem(item);
            setIsDeleteModalVisible(true);
        }
        
    }

    const handleShareDelete = async () => {

        setIsDeleteLoading(true);

        const signed = await isSigned();

        if( signed && address && vault){

            try{

                const _r = await vault['removeShareditem'](ItemType.DEBIT_CARD, item.address, {from: address});

                _r.wait().then(() => {
                    //BOOBS
                }).catch((err: any) =>{
                    console.log(err);
                }).finally(()=>{
                    setIsDeleteLoading(false);
                });

            }catch (e) {
                console.log(e);
                setIsDeleteLoading(false);
            }

        }

    }

    return (
        <>
            <div className={"item-card loyality-card"}>

                <div className="item-card-body">
                    <h5 className="item-card-title">
                        {!item.isOwn && <LinkIcon className={"mx-2"} title={"Shared item"}/>}
                        {item.name}
                    </h5>
                    <span className="item-card-text">
                        {item.name_on_card + " " + maskCaracters(item.card_id)}
                        <br/>
                    </span>
                    <a target={"_blank"} className={"item-card-text link-purple text-white text-decoration-none"}
                       href={`${CHAINS.get(chainId)?.explorerUrl ?? ""}/address/${item.address}`}>
                        <small>{item.address}</small>
                    </a>
                </div>
                <div className={"item-card-footer"}>
                    {!item.restricted &&
                        <button onClick={handleOpen} className="btn-hover btn-circle"><Unlock/></button>
                    }
                    {
                        item.isOwn && <>
                            <button onClick={handleEdit} className="btn-hover btn-circle"><PencilSquare/></button>
                            <Link to={"/share/" + ItemType.DEBIT_CARD + "/" + item.address}
                                  className="btn-hover btn-circle mr-5">
                                <Share/>
                            </Link>
                        </>
                    }

                    <button onClick={item.isOwn ? handleDelete : handleShareDelete} className="btn-hover btn-circle">
                        {
                            isDeleteLoading ?
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                </>
                                : <Trash/>
                        }
                    </button>
                </div>

            </div>
        </>
    )
}

export default DebitCard;