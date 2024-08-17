import { FC } from "react";
import Link from "next/link";
import { Web3ModalProvider } from "@/common/layout/Web3Modal";
import { useWeb3ModalAccount } from '@web3modal/ethers/react';

const Header : FC = () => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();

    return (
        <>
            <Web3ModalProvider/>
            <header className="header shadow">
                <Link href={"/"} className="logo">
                    &nbsp; BlockVAULT
                </Link>
                {/*<nav>*/}
                {/*    /!*<Link href={"/encrypt"}>*!/*/}
                {/*    /!*    Encrypt*!/*/}
                {/*    /!*</Link>*!/*/}
                {/*    /!*<Link href={"/decrypt"}>*!/*/}
                {/*    /!*    Decrypt*!/*/}
                {/*    /!*</Link>*!/*/}
                {/*    /!*<Link href={"/token"}>*!/*/}
                {/*    /!*    Token*!/*/}
                {/*    /!*</Link>*!/*/}
                {/*</nav>*/}
                <div className={"d-flex align-items-center"}>
                    {isConnected && <w3m-button balance="hide" size="md"/>}
                </div>
            </header>
        </>
    )
}

export default Header;