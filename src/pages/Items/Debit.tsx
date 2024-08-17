
import { FC, useState } from "react";
import { PlusCircle, Eye, Arrow90degDown } from 'react-bootstrap-icons';
import DebitList from "@/modules/Lists/Items/DebitList";
import DebitForm from "@/modules/Forms/Items/DebitForm";
import DebitCardType from "@/types/Items/DebitCardType";
import DebitCard from "@/modules/Items/DebitCard";
import { Contract } from "ethers";
import { ItemType } from "@/types/ItemType";
import ShareImportForm from "@/modules/Forms/Items/ShareImportForm";

type Props = {
    vault: Contract | null
}
const Debit : FC<Props> = ({ vault }) => {

    const [isCreate, setIsCreate] = useState(false);
    const [item, setItem] = useState<DebitCardType|null>(null);
    const [items, setItems] = useState<DebitCardType[]|any>([]);
    const [isListView, setIsListView] = useState(true);
    const [isFormView, setIsFormView] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [searchResults, setSearchResults] = useState<typeof DebitCard[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const setFormView = ()=>{
        setIsCreate(true);
        setIsListView(false);
        setIsFormView(true);
    }
    const setFormEditView = ()=>{
        setIsCreate(false);
        setIsListView(false);
        setIsFormView(true);
    }
    const setListView = ()=>{
        setIsCreate(false);
        setIsListView(true);
        setIsFormView(false);
    }

    const setImportView = ()=>{
        setIsCreate(false);
        setIsListView(false);
        setIsFormView(false);
    }

    const isItemIncludes = (item: any, value: string) => {
        return item.name.toLowerCase().includes(value) ||
                item.card_id.toLowerCase().includes(value) ||
                item.name_on_card.toLowerCase().includes(value) ||
                item.address.toLowerCase().includes(value)
            ;
    }

    const onSearchChange = (e: any) => {

        const _value = e.target.value.trim().toLowerCase();

        if(_value == ""){
            setIsSearch(false);
            return;
        }

        setSearchResults(
            items.filter( (item: typeof DebitCard) => isItemIncludes( item, _value ) )
                .map( (item: any) => <DebitCard item={item} setItem={setItem} setIsModalVisible={setIsModalVisible} setIsDeleteModalVisible={setIsDeleteModalVisible} vault={vault} key={item.address + Math.random()}  setFormEditView={setFormEditView}/>  )
        )

        setIsSearch(true);
        return;

    }

    return (
        <>
            <div className={"page-header"}>
                <div>
                    <h2 className={"page-title"}>Debit</h2>
                </div>
                <div className={"page-header-btn-wrapper"}>
                    <input name={"search"} onChange={onSearchChange} placeholder={"Search"}/>
                    <button onClick={setImportView} className={"btn-hover btn-circle"}>
                        <Arrow90degDown size={16}/> &nbsp;Import
                    </button>
                    <button onClick={setListView} className={"btn-hover btn-circle"}>
                        <Eye size={16}/> &nbsp;List
                    </button>
                    <button onClick={setFormView} className={"btn-hover btn-circle"}>
                        <PlusCircle size={16}/> &nbsp;Create
                    </button>
                </div>
            </div>
            <div className={"page-body border-white"}>
                {
                    isListView ?
                        <DebitList
                            setItems={setItems}
                            isSearch={isSearch}
                            searchResults={searchResults as typeof DebitCard[]}
                            setFormEditView={setFormEditView}
                            item={item}
                            setItem={setItem}
                            isModalVisible={isModalVisible}
                            setIsModalVisible={setIsModalVisible}
                            isDeleteModalVisible={isDeleteModalVisible}
                            setIsDeleteModalVisible={setIsDeleteModalVisible}
                            vault={vault}
                        /> : isFormView ?
                        <DebitForm
                            isCreate={isCreate}
                            vault={vault}
                            setListView={setListView}
                            item={item}
                        /> :
                        <ShareImportForm
                            itemType={ItemType.DEBIT_CARD}
                            vault={vault}
                            setListView={setListView}
                        />
                }
            </div>
        </>
    )
}

export default Debit;