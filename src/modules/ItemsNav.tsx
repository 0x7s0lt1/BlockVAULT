import { FC } from "react";
import { Key, CreditCard, PostcardHeart } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";
const ItemsNav : FC = () => {

    return (
        <>
            <nav className={"border-white slot-hover"}>
                <Link className={"nav-item btn-hover"} to={"/password/list"}>
                    <Key size={26}/> &nbsp; Password
                </Link>
                <Link className={"nav-item btn-hover"} to={"/debit/list"}>
                    <CreditCard size={26}/> &nbsp; Debit Card
                </Link>
                <Link className={"nav-item btn-hover"} to={"/loyality/list"}>
                    <PostcardHeart size={26}/> &nbsp; Loyality Card
                </Link>
            </nav>
        </>
    )
}

export default ItemsNav;