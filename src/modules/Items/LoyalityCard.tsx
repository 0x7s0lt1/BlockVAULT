import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { PencilSquare, Share, Trash, UpcScan, Link as LinkIcon } from 'react-bootstrap-icons';
import { BrowserProvider, Contract} from "ethers";
import LoyalityCardType from "@/types/Items/LoyalityCardType";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { CHAINS, hasValidSignature } from "@/types/Utils";
import { ItemType } from "@/types/ItemType";

type Props = {
    item: LoyalityCardType,
    setFormEditView: Function,
    setItem: Function,
    setIsModalVisible: Function,
    setIsDeleteModalVisible: Function,
    vault: Contract | null
}
const LoyalityCard: FC<Props> = ({item, setFormEditView, setItem, setIsModalVisible, setIsDeleteModalVisible, vault}) => {

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

                const _r = await vault['removeShareditem'](ItemType.LOYALITY_CARD, item.address, {from: address});

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
                        {item.number}
                        <br/>
                    </span>
                    <a target={"_blank"} className={"item-card-text link-purple text-white text-decoration-none m-0"}
                       href={`${CHAINS.get(chainId)?.explorerUrl ?? ""}/address/${item.address}`}
                    >
                        <small>{item.address}</small>
                    </a>
                </div>
                <div className={"item-card-footer"}>
                    {!item.restricted &&
                        <button onClick={handleOpen} className="btn-hover btn-circle"><UpcScan/></button>
                    }
                    {
                        item.isOwn && <>
                        <button onClick={handleEdit} className="btn-hover btn-circle"><PencilSquare/></button>
                            <Link to={"/share/" + ItemType.LOYALITY_CARD + "/" + item.address}
                                  className="btn-hover btn-circle">
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

export default LoyalityCard;