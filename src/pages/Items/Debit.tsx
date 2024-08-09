
import { FC, useState } from "react";
import { PlusCircle, Eye } from 'react-bootstrap-icons';
import DebitList from "@/modules/Lists/Items/DebitList";
import DebitForm from "@/modules/Forms/Items/DebitForm";
import DebitCardType from "@/types/Items/DebitCardType";
import DebitCard from "@/modules/Items/DebitCard";

type Props = {
    vault: Contract | null
}
const Debit : FC<Props> = ({vault}) => {

    const [isCreate, setIsCreate] = useState(false);
    const [item, setItem] = useState<DebitCardType|null>(null);
    const [items, setItems] = useState<DebitCardType[]>([]);
    const [isListView, setIsListView] = useState(true);
    const [isSearch, setIsSearch] = useState(false);
    const [searchResults, setSearchResults] = useState<DebitCardType[]>([]);
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

    const isItemIncludes = (item: DebitCardType, value: string) => {
        return item.name.toLowerCase().includes(value) ||
                item.card_id.toLowerCase().includes(value) ||
                item.name_on_card.toLowerCase().includes(value) ||
                item.expire_at.toLowerCase().includes(value) ||
                item.cvv.toLowerCase().includes(value);
    }

    const onSearchChange = (e: any) => {

        const _value = e.target.value.trim().toLowerCase();

        if(_value == ""){
            setIsSearch(false);
            return;
        }

        setSearchResults(
            items.filter( (item: DebitCardType) => isItemIncludes( item, _value ) )
                .map( (item: DebitCardType) => <DebitCard item={item} setItem={setItem} setIsModalVisible={setIsModalVisible} setIsDeleteModalVisible={setIsDeleteModalVisible} vault={vault} key={item.address + Math.random()}  setFormEditView={setFormEditView}/>  )
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
                        <DebitForm
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

export default Debit;