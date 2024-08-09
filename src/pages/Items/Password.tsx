
import { FC, useState } from "react";
import { PlusCircle, Eye } from 'react-bootstrap-icons';
import PasswordList from "@/modules/Lists/Items/PasswordList";
import PasswordForm from "@/modules/Forms/Items/PasswordForm";
import PasswordType from "@/types/Items/PasswordType";
import PasswordItem from "@/modules/Items/Password";

type Props = {
    vault: Contract | null
}
const Password : FC<Props> = ({vault}) => {

    const [isCreate, setIsCreate] = useState(false);
    const [item, setItem] = useState<PasswordType|null>(null);
    const [items, setItems] = useState<PasswordType[]>([]);
    const [isListView, setIsListView] = useState(true);
    const [isSearch, setIsSearch] = useState(false);
    const [searchResults, setSearchResults] = useState<PasswordType[]>([]);
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

    const isItemIncludes = (item: PasswordType, value: string) => {
        return item.name.toLowerCase().includes(value) ||
            item.url.toLowerCase().includes(value) ||
            item.user_name.toLowerCase().includes(value) ||
            item.password.toLowerCase().includes(value);
    }

    const onSearchChange = (e: any) => {

        const _value = e.target.value.trim().toLowerCase();

        if(_value == ""){
            setIsSearch(false);
            return;
        }

        setSearchResults(
            items.filter( (item: PasswordType) => isItemIncludes( item, _value ) )
                .map( (item: PasswordType) => <PasswordItem item={item} setItem={setItem} setIsModalVisible={setIsModalVisible} setIsDeleteModalVisible={setIsDeleteModalVisible} vault={vault} key={item.address + Math.random()}  setFormEditView={setFormEditView}/>  )
        )

        setIsSearch(true);
        return;

    }

    return (
        <>
            <div className={"page-header"}>
                <div>
                    <h2 className={"page-title"}>Password</h2>
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
                        <PasswordList
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
                        <PasswordForm
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

export default Password;