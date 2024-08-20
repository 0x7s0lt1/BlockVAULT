import { FC, useState } from "react";
import { Lock, Unlock } from 'react-bootstrap-icons';
import EncryptForm from "@/modules/Forms/File/EncryptForm";
import DecryptForm from "@/modules/Forms/File/DecryptForm";
import { Contract } from "ethers";

type Props = {
    vault: Contract | null
}
const File : FC<Props> = ({vault}) => {

    const [isEncryptView, setIsEncryptView] = useState(true);
    const [isDecryptView, setIsDecryptView] = useState(false);

    const setEncryptView = ()=>{
        setIsEncryptView(true);
        setIsDecryptView(false);
    }
    const setDecryptView = ()=>{
        setIsEncryptView(false);
        setIsDecryptView(true);
    }


    return (
        <>
            <div className={"page-header"}>
                <div>
                    <h2 className={"page-title"}>File {isEncryptView ? "Encrypt" : "Decrypt"}</h2>
                </div>
                <div className={"page-header-btn-wrapper"}>
                    <button onClick={setEncryptView} className={"btn-hover btn-circle"}>
                        <Lock size={16}/> &nbsp;Encrypt
                    </button>
                    <button onClick={setDecryptView} className={"btn-hover btn-circle"}>
                        <Unlock size={16}/> &nbsp;Decrypt
                    </button>
                </div>
            </div>
            <div className={"page-body border-white"}>
                {
                    isEncryptView ? <EncryptForm/> : <DecryptForm/>
                }
            </div>
        </>
    )
}

export default File;