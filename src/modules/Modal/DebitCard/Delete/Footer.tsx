import { FC, useState } from "react";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ItemType } from "@/types/ItemType";
import DebitCardType from "@/types/Items/DebitCardType";
import { Contract } from "ethers";


type Props = {
    fetchItems: Function,
    item: DebitCardType|null,
    setIsDeleteModalVisible: Function,
    setItem: Function,
    vault: Contract | null
}
const Footer : FC<Props> = ({ fetchItems, item, setIsDeleteModalVisible, setItem, vault }) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async ()=>{
        try{
            setIsLoading(true);

            if(vault !== null && item !== null){

                const response = await vault['deleteItem'](ItemType.DEBIT_CARD, item.address, {from: address});

                response.wait().then( async ()=>{
                    setIsLoading(false);
                    setItem(null);
                    setIsDeleteModalVisible(false);
                    await fetchItems();
                });

            }
        }catch (e) {
            console.log(e);
            setIsLoading(false);
        }

    }
    const handleCancel = ()=>{
        setItem(null);
        setIsDeleteModalVisible(false);
    }

    return (
        <>
            <div className={'loy-del-footer'}>
                <p className={"card-err-msg"}>{error}</p>
                {
                    !isLoading && <button onClick={handleCancel}  className={"btn-hover btn-circle"}>Cancel</button>
                }
                <button onClick={handleDelete} disabled={isLoading} className={"btn-hover btn-circle"}>
                    {isLoading ?
                        <>
                            <span className="spinner-border text-light" role="status"></span>
                            &nbsp; Deleting...
                        </>
                        :
                        <>
                            Delete
                        </>
                    }
                </button>
            </div>
        </>
    )
}

export default Footer;