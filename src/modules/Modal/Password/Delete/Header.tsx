import { FC } from "react";
import PasswordType from "@/types/Items/PasswordType";

type Props = {
    item: PasswordType|null
}
const Header : FC<Props> = ({ item }) => {

    return (
        <>
            <h3>{`Delete`}</h3>
            <p>
                {item ? item.name : ""}
            </p>
        </>
    )
}

export default Header;