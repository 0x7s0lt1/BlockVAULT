
import { FC, useState, useRef, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';
import { CloudDownload, Unlock } from 'react-bootstrap-icons';
import { decryptData, downloadFile, FILE_SIGN_MESSAGE, getBase64, maskCaracters } from "@/types/Utils";

type Props = {
    vault?: Contract | null,
}
const DecrypForm : FC<Props> = ({ vault }) => {

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
    const [decFile, setDecFile] = useState<string|null>(null);
    const [error, setError] = useState<string|null>('');


    const handleFileChange = async (e: any) => {

        if(e.target.files.length > 0) {
            setFile( e.target.files[0] );
            setError('');
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
        setError("");

        let file: File|null = null;
        if(fileRef.current && fileRef.current.files){
            file = fileRef.current.files[0];
        }

        if(file) {

            try{
                setFile(file);

                const base64 = await getBase64(file, true);
                const signature = await signer.signMessage(FILE_SIGN_MESSAGE);

                const decryptedFile = decryptData( base64, signature );

                setDecFile(decryptedFile);
                setIsLoading(false);

            }catch (e){
                console.log(e);
                setError("Decryption Failed");
                setIsLoading(false);
            }

        }else{
            setError('Please choose a file to encrypt');
            setIsLoading(false);
        }


    }

    const handleDownload = async (e: any) => {
        if(decFile && file){
            await downloadFile(decFile, file.name, false);
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
                    Here, you can only decrypt the files with your wallet's signature that were encrypted on this platform.
                </p>

                    <div className={"form-slot"}>
                        <div className={"form-input d-flex align-items-center "}>
                            <button onClick={handleFileClick} className={"btn-hover btn-circle shadow"}>Choose File
                            </button>
                            <span
                                className={"text-gray mx-2"}><i>{maskedFileName ?? "Chose a file to encrypt..."}</i></span>
                        </div>
                        <input onChange={handleFileChange} className={"d-none"} type={"file"} name={"name"}
                               ref={fileRef}/>
                    </div>

                    <p className={"form-error"}>
                        &nbsp;{error}
                    </p>

                    <div className={"form-footer justify-content-between"}>

                        <div>
                            {decFile &&
                                <>
                                    <span className={"mx-2 my-2"}><i
                                        className={"text-gray"}> <Unlock/> {maskedFileName}</i></span>
                                    <button onClick={handleDownload}
                                            className={"btn-hover btn-circle shadow cursor-pointer my-2"}>
                                        <CloudDownload/> &nbsp; Download File
                                    </button>
                                </>
                            }
                        </div>

                        <button onClick={handleSubmit} disabled={isLoading}
                                className={"btn-hover btn-circle submit-btn"}>
                            {isLoading ?
                                <>
                                    <span className="spinner-border text-light" role="status"></span>
                                    &nbsp; {"Decrypting..."}
                                </>
                                :
                                <>
                                    {"Decrypt"}
                                </>
                            }
                        </button>
                    </div>

            </div>
        </>
)
}

export default DecrypForm;