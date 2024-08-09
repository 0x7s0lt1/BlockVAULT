import React, {FC, useEffect, useState, useRef} from "react";
import MainLayout from "@/common/layout/MainLayout";
import Footer from "@/common/layout/footer/Footer";
import Meta from "@/common/layout/Meta";
import {Badge, Spinner} from "react-bootstrap";
import {useWeb3ModalAccount, useWeb3ModalProvider, useWeb3Modal } from "@web3modal/ethers/react";
import { BrowserProvider, ContractFactory} from "ethers";
import { Abi, byteCode } from "@/contract/pigmentresor";
import  AES from "crypto-js/aes";
import confetti from "canvas-confetti";

const Encrypt: FC = () => {

    const CHUNK_SIZE = 20 * 1024;

    const { open, close } = useWeb3Modal();
    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const fileRef = useRef<HTMLInputElement>(null);

    const [fileName, setFileName] = useState("");
    const [rawFile, setRawFile] = useState("");
    const [encryptedFile, setEncryptedFile] = useState("");
    const [contractAddress, setContractAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [fileReadingLoading, setFileReadingLoading] = useState(false);
    const [polygonPushLoading, setPolygonPushLoading] = useState(false);
    const [ disabled, setDisabled] = useState(true);


    const  splitStringIntoChunks = (str: string) => {
        const chunks = [];
        let index = 0;

        while (index < str.length) {
            chunks.push(str.substring(index, index + CHUNK_SIZE));
            index += CHUNK_SIZE;
        }

        return chunks;
    }

    const handleFileClick = () => {
        if(fileRef.current !== undefined && fileRef.current !== null){
            fileRef.current.click();
        }
    };

    const downloadFile = () => {

        const blob = new Blob([encryptedFile], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.download = "encrypted_" + fileName;
        link.href = url;

        link.click();
        
    }

    const handleFileChange = (event: any) => {

        event.preventDefault();

        const file = event.target.files[0];

        if(file !== undefined){

            setFileReadingLoading(true);
            setFileName(file.name);
            setRawFile("");
            setEncryptedFile("");

            const reader = new FileReader();

            reader.onload = (e) => {

                if(e.target !== null){

                    if(e.target.result !== null){
                        setRawFile(e.target.result as string);
                        setDisabled(false);
                        setFileReadingLoading(false);

                        return;
                    }

                }

                setFileReadingLoading(false);
            }

            reader.readAsDataURL(file);

        }

    }
    const handleEncrypt = async () => {

        setLoading(true);

        if (isConnected) {
            if(walletProvider !== undefined){
                try{
                    const provider = new BrowserProvider(walletProvider);

                    //const provider = new ethers.JsonRpcProvider();

                    const signer = await provider.getSigner();
                    const signature = await signer?.signMessage('Please sign this message to encrypt/decrypt your data.');

                    const encrypted = AES.encrypt(rawFile, signature).toString();

                    const chunks = splitStringIntoChunks(encrypted);

                    console.log(chunks.length, chunks);

                    setEncryptedFile(encrypted);
                    setLoading(false);

                }catch (e){
                    setLoading(false);
                    console.log(e);
                }

            }
        }else{
            await open();
            setLoading(false);
        }

    }

    const handelPushToPolygon = async () => {

        if(isConnected){

            if(walletProvider !== undefined){

                setPolygonPushLoading(true);

                try{
                    const provider = new BrowserProvider(walletProvider);

                    const signer = await provider.getSigner();
                    const factory = new ContractFactory(Abi, byteCode, signer);

                    const contract = await factory.deploy(encryptedFile, "pigmentresor_"+fileName);

                    if(contract !== undefined && contract !== null){

                        contract.deploymentTransaction()?.wait().then((receipt) => {

                            console.log(receipt);

                            setContractAddress(receipt?.contractAddress ?? "");
                            setPolygonPushLoading(false);
                            confetti();

                        });

                    }else{
                        setPolygonPushLoading(false);
                    }

                }catch (e){
                    setPolygonPushLoading(false);
                    console.log(e);
                }

            }

        }

    }

    return (
        <>
            <MainLayout>
                <Meta title={"Blog"} description={"PigmentToken"}/>

                <div className="d-flex align-items-center mt-5">
                    <div className="w-100 p-xl-2 wheat d-flex justify-content-center align-items-center">
                        <span className="w-75">
                            <h1>Encrypt</h1>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </span>
                    </div>
                </div>

                <div className="d-flex justify-content-center flex-wrap">
                    <div className="my-5 d-flex justify-content-around rounded-5 shadow bg-ligh p-lg-3  w-75"
                         style={{background: "rgba(53,59,46,0.1)"}}
                         data-aos="zoom-in-up">
                        <div className="w-75 d-flex align-items-center file-input shadow">
                            <div className="file-name wheat w-75">{fileName}</div>
                            <button onClick={handleFileClick} className="shadow-lg file-input-btn w-25">
                                {
                                    fileReadingLoading ?
                                        <Spinner animation="border" variant="light" size="sm"/> : "SELECT FILE"
                                }
                            </button>
                        </div>
                        <input ref={fileRef} onChange={handleFileChange} type="file" name="file"
                               className="d-none"/>
                        <button onClick={handleEncrypt} disabled={disabled} className="decrypt-btn shadow-lg">
                            {
                                loading ? <Spinner animation="border" variant="light" size="sm"/> : "ENCRYPT"
                            }
                        </button>
                    </div>

                    {
                        encryptedFile !== "" &&
                        <>
                            <div className="w-75">
                                <h3 className="wheat">Your File Encrypted </h3>
                                <span className="wheat">{`${"encrypted_"}${fileName}`}</span>
                                <div className="mb-5 mt-3 rounded-5 shadow bg-ligh p-lg-3 w-100"
                                     style={{background: "rgba(53,59,46,0.1)"}}
                                     data-aos="zoom-in-up">

                                    <div className="w-100 d-flex justify-content-around align-items-center">
                                        <button onClick={downloadFile} className="decrypt-btn shadow-lg w-40 ">DOWNLOAD</button>
                                        <button onClick={handelPushToPolygon} className="decrypt-btn shadow-lg w-40 ">
                                            {
                                                polygonPushLoading ? <Spinner animation="border" variant="light"
                                                                              size="sm"/> : "PUSH TO POLYGON"
                                            }
                                        </button>
                                    </div>
                                </div>

                                {
                                    contractAddress !== "" &&
                                    <>
                                        <div className="w-100">
                                            <h3 className="wheat">Contract Address</h3>

                                            <a href={`https://polygonscan.com/address/${contractAddress}`}>
                                                {`https://polygonscan.com/address/${contractAddress}`}
                                            </a>
                                        </div>
                                    </>
                                }

                            </div>
                        </>
                    }

                </div>

                <div className="placeholder"></div>
            </MainLayout>
            <Footer/>
        </>
    )
}

export default Encrypt;