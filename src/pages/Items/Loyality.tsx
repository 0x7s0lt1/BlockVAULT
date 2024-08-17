import {FC, useState} from "react";
import { Arrow90degDown, Eye, PlusCircle } from 'react-bootstrap-icons';
import LoyalityList from "@/modules/Lists/Items/LoyalityList";
import LoyalityForm from "@/modules/Forms/Items/LoyalityForm";
import LoyalityCardType from "@/types/Items/LoyalityCardType";
import LoyalityCard from "@/modules/Items/LoyalityCard";
import { Contract } from "ethers";
import ShareImportForm from "@/modules/Forms/Items/ShareImportForm";
import { ItemType } from "@/types/ItemType";

type Props = {
    vault: Contract | null
}
const Loyality : FC<Props> = ({vault}) => {

    const [isCreate, setIsCreate] = useState(false);
    const [item, setItem] = useState<LoyalityCardType|null>(null);
    const [items, setItems] = useState<LoyalityCardType[]|any>([]);
    const [isListView, setIsListView] = useState(true);
    const [isFormView, setIsFormView] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [searchResults, setSearchResults] = useState<typeof LoyalityCard[]>([]);
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
            item.number.toLowerCase().includes(value) ||
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
            items.filter( (item: typeof LoyalityCard) => isItemIncludes( item, _value ) )
                .map( (item: any) => <LoyalityCard item={item} setItem={setItem} setIsModalVisible={setIsModalVisible} setIsDeleteModalVisible={setIsDeleteModalVisible} vault={vault} key={item.address + Math.random()}  setFormEditView={setFormEditView}/>  )
        )

        setIsSearch(true);
        return;

    }


    return (
        <>
            <div className={"page-header"}>
                <div>
                    <h2 className={"page-title"}>Loyality</h2>
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
                        <LoyalityList
                            setItems={setItems}
                            isSearch={isSearch}
                            searchResults={searchResults}
                            setFormEditView={setFormEditView}
                            item={item}
                            setItem={setItem}
                            isModalVisible={isModalVisible}
                            setIsModalVisible={setIsModalVisible}
                            isDeleteModalVisible={isDeleteModalVisible}
                            setIsDeleteModalVisible={setIsDeleteModalVisible}
                            vault={vault}
                        /> : isFormView ?
                        <LoyalityForm
                            isCreate={isCreate}
                            vault={vault}
                            setListView={setListView}
                            item={item}
                        /> :
                        <ShareImportForm
                            itemType={ItemType.LOYALITY_CARD}
                            vault={vault}
                            setListView={setListView}
                        />
                }

            </div>
        </>
    )
}

export default Loyality;