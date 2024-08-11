
import { FC, useState } from "react";
import { PlusCircle, Eye } from 'react-bootstrap-icons';
import PasswordList from "@/modules/Lists/Items/PasswordList";
import PasswordForm from "@/modules/Forms/Items/PasswordForm";
import PasswordType from "@/types/Items/PasswordType";
import PasswordItem from "@/modules/Items/Password";
import { Contract } from "ethers";

type Props = {
    vault: Contract | null
}
const Password : FC<Props> = ({vault}) => {

    const [isCreate, setIsCreate] = useState<boolean>(false);
    const [item, setItem] = useState<PasswordType|null>(null);
    const [items, setItems] = useState<PasswordType[]|any>([]);
    const [isListView, setIsListView] = useState<boolean>(true);
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [searchResults, setSearchResults] = useState<typeof PasswordItem[]>([]);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false);

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

    const isItemIncludes = (item: any, value: string) => {
        return item.name.toLowerCase().includes(value) ||
            item.url.toLowerCase().includes(value) ||
            item.address.toLowerCase().includes(value);
    }

    const onSearchChange = (e: any) => {

        const _value = e.target.value.trim().toLowerCase();

        if(_value == ""){
            setIsSearch(false);
            return;
        }

        setSearchResults(
            items.filter( (item: typeof PasswordItem) => isItemIncludes( item, _value ) )
                .map( (item: any) => <PasswordItem item={item} setItem={setItem} setIsModalVisible={setIsModalVisible} setIsDeleteModalVisible={setIsDeleteModalVisible} vault={vault} key={item.address + Math.random()}  setFormEditView={setFormEditView}/>  )
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