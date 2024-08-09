import {FC} from "react";
import Link from "next/link";
import {Web3ModalProvider} from "@/common/layout/Web3Modal";

const Header : FC = () => {

    return (
        <>
            <Web3ModalProvider/>
            <header className="header shadow">
                <Link href={"/"} className="logo">
                    &nbsp; BLOCKVAULT
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
                <w3m-button balance="hide" size="md"/>
            </header>
        </>
    )
}

export default Header;