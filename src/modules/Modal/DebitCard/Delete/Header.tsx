import { FC } from "react";
import DebitCardType from "@/types/Items/DebitCardType";

type Props = {
    item: DebitCardType|null
}
const Header : FC<Props> = ({ item }) => {

    return (
        <>
            {`Delete ${item ? item.name : ""}`}
        </>
    )
}

export default Header;