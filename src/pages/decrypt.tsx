import React, {FC, useEffect, useState, useRef} from "react";
import MainLayout from "@/common/layout/MainLayout";
import Footer from "@/common/layout/footer/Footer";
import Meta from "@/common/layout/Meta";
import { useRouter } from 'next/router'
import {BrowserProvider, Contract} from "ethers";
import {useWeb3ModalAccount, useWeb3ModalProvider, useWeb3Modal } from "@web3modal/ethers/react";
import { Abi } from "@/contract/pigmentresor";
import {Spinner} from "react-bootstrap";
import  AES from "crypto-js/aes";
import CryptoJS from "crypto-js/core";

const Decrypt: FC = () => {

    const router = useRouter();
    const { open, close } = useWeb3Modal();
    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();


    const [contractAddress, setContractAddress] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDecrypt = async () => {

        if(contractAddress !== ""){

            setLoading(true);

            if(isConnected){

                if(walletProvider !== undefined){

                    const provider = new BrowserProvider(walletProvider);
                    const contract = new Contract(contractAddress, Abi, provider);

                    const encryptedFile = await contract['getFile']({from: address});
                    const fileName = await contract['getFileName']({from: address});

                    const signer = await provider.getSigner();
                    const signature = await signer?.signMessage('Please sign this message to encrypt/decrypt your data.');
                    const key =  CryptoJS.enc.Hex.parse(signature);

                    const decrypted =  AES.decrypt(encryptedFile, signature).toString(CryptoJS.enc.Utf8);


                    downloadFile(decrypted, fileName);

                    setLoading(false);

                }

            }else{

                await open();
                setLoading(false);

                return;
            }

        }

    };

    const downloadFile = (base64Data: string, fileName: string) => {

        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', base64Data);
        downloadLink.setAttribute('download', fileName);

        downloadLink.click();

    }

    useEffect(() => {
        const _contractAddress = router.query.contractAddress;

        if(_contractAddress){
            setContractAddress(_contractAddress as string);
        }

    },[router.query.contractAddress]);


    return (
        <>
            <MainLayout>
                <Meta title={"About"} description={"PigmentToken"}/>
                <div className="d-flex align-items-center mt-5">
                    <div className="w-100 p-xl-2 wheat d-flex justify-content-center align-items-center">
                        <span className="w-75">
                            <h1>Decrypt</h1>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </span>
                    </div>
                </div>

                <div className="d-flex justify-content-center flex-wrap">
                    <div className="my-5 d-flex justify-content-around rounded-5 shadow bg-ligh p-lg-3  w-75"
                         style={{background: "rgba(53,59,46,0.1)"}}
                         data-aos="zoom-in-up">
                        <input
                            value={contractAddress}
                            onChange={e => { setContractAddress(e.currentTarget.value); }}
                            type="text" name="contract-address"
                               className="shadow address-input w-75" placeholder="0x Contract Address..."/>
                        <button onClick={handleDecrypt} className="decrypt-btn shadow">
                            {
                                loading ? <Spinner animation="border" variant="light" size="sm"/> : "DECRYPT"
                            }
                        </button>
                    </div>

                    {/*<div className="my-5 rounded-5 shadow bg-ligh p-lg-5 w-75"*/}
                    {/*     style={{background: "rgba(53,59,46,0.1)"}}*/}
                    {/*     data-aos="zoom-in-up"></div>*/}


                </div>

                <div className="placeholder"></div>
            </MainLayout>
            <Footer/>
        </>
    )
}

export default Decrypt;