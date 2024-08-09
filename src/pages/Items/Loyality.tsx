
import { FC, useState } from "react";
import { PlusCircle, Eye } from 'react-bootstrap-icons';
import LoyalityList from "@/modules/Lists/Items/LoyalityList";
import LoyalityForm from "@/modules/Forms/Items/LoyalityForm";
import LoyalityCardType from "@/types/Items/LoyalityCardType";
import LoyalityCard from "@/modules/Items/LoyalityCard";

type Props = {
    vault: Contract | null
}
const Loyality : FC<Props> = ({vault}) => {

    const [isCreate, setIsCreate] = useState(false);
    const [item, setItem] = useState<LoyalityCardType|null>(null);
    const [items, setItems] = useState<LoyalityCardType[]>([]);
    const [isListView, setIsListView] = useState(true);
    const [isSearch, setIsSearch] = useState(false);
    const [searchResults, setSearchResults] = useState<LoyalityCardType[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

    const setFormView = ()=>{
        setIsCreate(true);
        setIsListView(false);
    }
    const setFormEditView = ()=>{
        setIsCreate(false);
        setIsListView(false);
    }
    const setListView = ()=>{
        setIsCreate(false);
        setIsListView(true);
    }

    const onSearchChange = (e: any) => {
        const _value = e.target.value.trim().toLowerCase();

        if(_value == ""){
            setIsSearch(false);
            return;
        }

        setSearchResults(
            items.filter( (item: LoyalityCardType) => item.name.toLowerCase().includes(_value) || item.number.toLowerCase().includes(_value) )
                .map( (item: LoyalityCardType) => <LoyalityCard item={item} setItem={setItem} setIsModalVisible={setIsModalVisible} setIsDeleteModalVisible={setIsDeleteModalVisible} vault={vault} key={item.address + Math.random()}  setFormEditView={setFormEditView}/>  )
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
                            items={items}
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
                        /> :
                        <LoyalityForm
                            isCreate={isCreate}
                            vault={vault}
                            setListView={setListView}
                            item={item}
                        />
                }
            </div>
        </>
    )
}

export default Loyality;