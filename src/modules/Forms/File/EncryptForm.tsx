
import { FC, useState, useRef, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { CloudDownload, Lock } from 'react-bootstrap-icons';
import {downloadFile, encryptData, FILE_SIGN_MESSAGE, getBase64, maskCaracters, MAX_FILE_SIZE} from "@/types/Utils";

type Props = {
    vault?: Contract | null,
}
const EncryptForm : FC<Props> = ({ vault }) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const fileRef = useRef<HTMLInputElement>(null);

    let provider: BrowserProvider;
    let signer: any;
    (async()=>{
        if(walletProvider){
            provider = new BrowserProvider(walletProvider);
            signer = await provider.getSigner();
        }
    })();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File|undefined>(undefined);
    const [maskedFileName, setMaskedFileName] = useState<string|null>(null);
    const [encFile, setEncFile] = useState<string|null>(null);
    const [error, setError] = useState<string|null>('');


    const handleFileChange = async (e: any) => {

        if(e.target.files.length > 0) {
            setFile( e.target.files[0] );

            if(e.target.files[0].size >= MAX_FILE_SIZE){
                setError('File must be less than 2GB');
                setIsLoading(false);
                return;
            }else{
                setError('');
            }

        }else{
            setError('Please choose a file to encrypt');
        }
    }

    const handleFileClick = async (e: any) => {
        if(fileRef.current !== undefined && fileRef.current !== null){
            fileRef.current.click();
        }
    }

    const handleSubmit = async (e: any) => {

        e.preventDefault();
        setIsLoading(true);

        let _file: File|null = null;
        if(fileRef.current && fileRef.current.files){
            _file = fileRef.current.files[0];
        }

        if(_file) {

            if(_file.size >= MAX_FILE_SIZE){
                setError('File must be less than 2GB');
                setIsLoading(false);
                return;
            }

            try{
                setFile(_file);

                const base64 = await getBase64(_file, false);
                const signature = await signer.signMessage(FILE_SIGN_MESSAGE);

                const encryptedFile = encryptData( base64, signature );

                setEncFile(encryptedFile);
                setIsLoading(false);


            }catch (e){
                console.log(e);
                setIsLoading(false);
            }

        }else{
            setError('Please choose a file to encrypt');
            setIsLoading(false);
        }


    }

    const handleDownload = async (e: any) => {
        if(encFile && file){
            await downloadFile(encFile, "[BlockVAULT]" + file.name, true, file.type);
        }
    }

    useEffect(() => {
        if(file){
            setMaskedFileName(maskCaracters(file.name, 15));
        }
    }, [file]);

    return (
        <>
            <div className={"form-wrapper"}>

                <p className={"px-5"}>
                    You can encrypt the files with your wallet's signature. Then, you can download and store the encrypted file for yourself. The file never leaves your computer.
                </p>

                <div className={"form-slot"}>
                    <div className={"form-input d-flex align-items-center "}>
                        <button onClick={handleFileClick} className={"btn-hover btn-circle shadow"}>Choose File</button>
                        <span className={"text-gray mx-2"}><i>{maskedFileName ?? "Chose a file to encrypt..."}</i></span>
                    </div>
                    <input onChange={handleFileChange} className={"d-none"} type={"file"} name={"name"} ref={fileRef}/>
                </div>


                <p className={"form-error"}>
                    &nbsp;{error}
                </p>

                <div className={"form-footer justify-content-between"}>

                    <div>
                        { encFile &&
                            <>
                                <span className={"mx-2 my-2"}><i
                                    className={"text-gray"}> <Lock/> {maskedFileName}</i></span>
                                <button onClick={handleDownload}
                                        className={"btn-hover btn-circle shadow cursor-pointer my-2"}>
                                    <CloudDownload/> &nbsp; Download File
                                </button>
                            </>
                        }
                    </div>

                    <button onClick={handleSubmit} disabled={isLoading} className={"btn-hover btn-circle submit-btn"}>
                        {isLoading ?
                            <>
                                <span className="spinner-border text-light" role="status"></span>
                                &nbsp; {"Encrypting..."}
                            </>
                            :
                            <>
                                {"Encrypt"}
                            </>
                        }
                    </button>
                </div>

            </div>
        </>
    )
}

export default EncryptForm;