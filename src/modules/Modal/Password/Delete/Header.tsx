import { FC } from "react";
import PasswordType from "@/types/Items/PasswordType";

type Props = {
    item: PasswordType|null
}
const Header : FC<Props> = ({ item }) => {

    return (
        <>
            {`Delete ${item ? item.name : ""}`}
        </>
    )
}

export default Header;