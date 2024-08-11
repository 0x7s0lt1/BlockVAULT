
import { FC, useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { ABI as PswABI } from "@/common/contract/Items/PasswordContract";
import { ItemType } from "@/types/ItemType";
import Password from "@/modules/Items/Password";
import PasswordType from "@/types/Items/PasswordType";
import Modal from "@/modules/Modal/Modal";
import Header from "@/modules/Modal/Password/View/Header";
import Body from "@/modules/Modal/Password/View/Body";
import Footer from "@/modules/Modal/Password/View/Footer";

import DeleteHeader from "@/modules/Modal/Password/Delete/Header";
import DeleteBody from "@/modules/Modal/Password/Delete/Body";
import DeleteFooter from "@/modules/Modal/Password/Delete/Footer";
import { CHAINS } from "@/types/Utils";

type Props = {
    setItems: Function,
    isSearch: boolean,
    searchResults: Array<typeof Password>,
    setFormEditView: Function,
    item: PasswordType|null,
    setItem: Function,
    isModalVisible: boolean,
    setIsModalVisible: Function,
    isDeleteModalVisible: boolean,
    setIsDeleteModalVisible: Function,
    vault: Contract | null
}
const PasswordList : FC<Props> = ({
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
        setItemsMap(<span className={"empty-label"}>No Passwords Yet</span>);

        try {
            if (address && isConnected && vault && walletProvider){

                if( CHAINS.get(chainId) !== undefined ){

                    const addresses = await vault['getItem']( ItemType.PASSWORD, {from: address});

                    if(addresses.length > 0){

                        const provider = new BrowserProvider(walletProvider);
                        const signer = await provider.getSigner();

                        const _items: PasswordType[] = [];
                        
                        for (const _address of addresses) {

                            const contract = new Contract(_address, PswABI, signer);
                            const card = await contract['expose']({from: address});

                            _items.push({
                                name: card[0],
                                url: card[1],
                                user_name: card[2],
                                password: card[3],
                                address: _address
                            } as PasswordType );

                        }

                        setItems(_items);
                        setItemsMap(
                            _items.map( (item: PasswordType) => <Password item={item} setFormEditView={setFormEditView} setItem={setItem} vault={vault} key={item.address + Math.random()}  setIsModalVisible={setIsModalVisible} setIsDeleteModalVisible={setIsDeleteModalVisible}/> )
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

export default PasswordList;