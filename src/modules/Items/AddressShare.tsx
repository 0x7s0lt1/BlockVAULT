import { FC, useState } from "react";
import { Trash } from 'react-bootstrap-icons';
import { BrowserProvider, Contract} from "ethers";
import { CHAINS, hasValidSignature } from "@/types/Utils";
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react';

type Props = {
    _address: string,
    handleDeleteShare: Function,
    vault: Contract | null
}
const AddressShare: FC<Props> = ({ _address, handleDeleteShare, vault }) => {

    const { walletProvider } = useWeb3ModalProvider();
    const { address, chainId, isConnected } = useWeb3ModalAccount();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isSigned = async (message: string) => {

        try{

            if (!walletProvider) {
                return false;
            }

            const provider = new BrowserProvider(walletProvider);
            const signer = await provider.getSigner();

            return await hasValidSignature(address, signer, message);

        }catch (e) {
            console.log(e);
            return false;
        }

    }

    const handleDelete = async ()=>{

        setIsLoading(true);

        const signed = await isSigned( "Sign this message to revoke share with " + _address );

        if( signed ){

           await handleDeleteShare( _address, ()=> {
               setIsLoading(false);
           });

        }else{
            setIsLoading(false);
        }



    }

    return (
        <>
            <div className={"item-card loyality-card s-addr-card"}>

                <div className="item-card-body">
                    <a target={"_blank"} className={"item-card-text link-purple text-white text-decoration-none"}
                       href={`${CHAINS.get(chainId)?.explorerUrl ?? ""}/address/${_address}`}>
                        <small>{_address}</small>
                    </a>
                </div>
                <div className={"item-card-footer"}>

                     <button onClick={handleDelete} className="btn-hover btn-circle">
                         {
                             isLoading ?
                                 <>
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                 </>
                                 : <Trash/>
                         }
                     </button>

                </div>

            </div>
        </>
    )
}

export default AddressShare;