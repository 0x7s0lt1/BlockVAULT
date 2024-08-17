
import React, {FC, useEffect, useState} from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ABI as DebABI } from "@/common/contract/Items/DebitCardContract";
import { ItemType } from "@/types/ItemType";
import Modal from "@/modules/Modal/Modal";
import Header from "@/modules/Modal/DebitCard/View/Header";
import Body from "@/modules/Modal/DebitCard/View/Body";
import Footer from "@/modules/Modal/DebitCard/View/Footer";

import DeleteHeader from "@/modules/Modal/DebitCard/Delete/Header";
import DeleteBody from "@/modules/Modal/DebitCard/Delete/Body";
import DeleteFooter from "@/modules/Modal/DebitCard/Delete/Footer";
import DebitCardType from "@/types/Items/DebitCardType";
import { CHAINS } from "@/types/Utils";
import DebitCard from "@/modules/Items/DebitCard";

type Props = {
    setItems: Function,
    isSearch: boolean,
    searchResults: Array<typeof DebitCard>,
    setFormEditView: Function,
    item: DebitCardType|null,
    setItem: Function,
    isModalVisible: boolean,
    setIsModalVisible: Function,
    isDeleteModalVisible: boolean,
    setIsDeleteModalVisible: Function,
    vault: Contract | null
}
const DebitList : FC<Props> = ({
                                      setItems,
                                      isSearch,
                                      searchResults,
                                      setFormEditView,
                                      item,
                                      setItem,
                                      isModalVisible,
                                      setIsModalVisible,
                                      isDeleteModalVisible,
                                      setIsDeleteModalVisible,
                                      vault
                                  }) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const [listIsLoading, setListIsLoading] = useState(true);
    const [itemsMap, setItemsMap] = useState<any>();

    const onModalClose = () => {
        setItem(null);
    }

    const fetchItems = async () => {
        setListIsLoading(true);
        setItems([]);
        setItemsMap(<span className={"empty-label"}>No Debit Cards Yet</span>);

        try {
            if (address && isConnected && vault && walletProvider){

                if( CHAINS.get(chainId) !== undefined ){

                    let addresses = await vault['getItem']( ItemType.DEBIT_CARD, {from: address});
                    addresses = addresses.concat( await vault['getSharedItems']( ItemType.DEBIT_CARD, {from: address}) );

                    if(addresses.length > 0){

                        const provider = new BrowserProvider(walletProvider);
                        const signer = await provider.getSigner();

                        const _items: DebitCardType[] = [];

                        for (const _address of addresses) {

                            const contract = new Contract(_address, DebABI, signer);

                            try{

                                const card = await contract['expose']({from: address});
                                const isOwn = await contract['isOwn']({from: address});

                                _items.push({
                                    isOwn,
                                    name: card[0],
                                    card_id: card[1],
                                    name_on_card: card[2],
                                    expire_at: card[3],
                                    cvv: card[4],
                                    address: _address
                                } as DebitCardType );

                            }catch (e) {
                                console.log(e);

                                _items.push({
                                    isOwn: false,
                                    name: "",
                                    card_id: "( access cancelled )",
                                    name_on_card: "",
                                    expire_at: BigInt(0),
                                    cvv: BigInt(0),
                                    address: _address,
                                    restricted: true
                                } as DebitCardType );

                            }

                        }
                        console.log(_items);

                        setItems(_items);
                        setItemsMap(
                            _items.map( (item: DebitCardType) => <DebitCard item={item} setFormEditView={setFormEditView} setItem={setItem} vault={vault} key={item.address + Math.random()}  setIsModalVisible={setIsModalVisible} setIsDeleteModalVisible={setIsDeleteModalVisible}/> )
                        );

                    }

                    setListIsLoading(false);

                }

            }

        }catch (e) {
            console.log(e);
            setListIsLoading(false);
        }

    }


    useEffect(() => {

        (async()=> {
            await fetchItems();
        })();

    }, []);

    useEffect(() => {

        (async()=> {
            await fetchItems();
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
                            {
                                isSearch ? searchResults : itemsMap
                            }
                        </>
                }

            </div>

            <Modal
                visible={isModalVisible}
                setVisible={setIsModalVisible}
                header={<Header item={item} />}
                body={<Body item={item} />}
                footer={<Footer item={item} />}
                onClose={onModalClose}
            />

            <Modal
                visible={isDeleteModalVisible}
                closeable={false}
                setVisible={setIsDeleteModalVisible}
                header={<DeleteHeader item={item} />}
                body={<DeleteBody item={item} />}
                footer={<DeleteFooter fetchItems={fetchItems} setIsDeleteModalVisible={setIsDeleteModalVisible} setItem={setItem} item={item} vault={vault} />}
                onClose={onModalClose}
            />

        </>
    )
}

export default DebitList;