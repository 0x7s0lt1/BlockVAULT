import { FC } from "react";
import PasswordType from "@/types/Items/PasswordType";

type Props = {
    item?: PasswordType
}
const Header : FC<Props> = ({ item }) => {

    return (
        <>
            {item ? item.name : ""}
        </>
    )
}

export default Header;