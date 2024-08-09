
import React, {FC, useEffect, useState} from "react";
import { PlusCircle, Eye } from 'react-bootstrap-icons';
import {Route, Routes} from "react-router-dom";
import LoyalityList from "@/modules/Lists/Items/LoyalityList";
import LoyalityForm from "@/modules/Forms/Items/LoyalityForm";

type Props = {
    vault: Contract | null
}
const Loyality : FC<Props> = ({vault}) => {

    const [isListView, setIsListView] = useState(true);

    const setFormView = ()=>{
        setIsListView(false);
    }
    const setListView = ()=>{
        setIsListView(true);
    }
    return (
        <>
            <div className={"page-header"}>
                <h2 className={"page-title"}>Loyality</h2>
                <div className={"page-header-btn-wrapper"}>
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
                    isListView ? <LoyalityList vault={vault}/> : <LoyalityForm vault={vault} setListView={setListView} />
                }
            </div>
        </>
    )
}

export default Loyality;