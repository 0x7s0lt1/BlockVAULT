import { FC } from "react";
import DebitCardType from "@/types/Items/DebitCardType";

type Props = {
    item: DebitCardType|null
}
const Header : FC<Props> = ({ item }) => {

    return (
        <>
            <h3>{`Delete ${item ? item.name : ""}`}</h3>
        </>
    )
}

export default Header;