import { FC } from "react";
import DebitCardType from "@/types/Items/DebitCardType";

type Props = {
    item?: DebitCardType
}
const Header : FC<Props> = ({ item }) => {

    return (
        <>
            {item ? item.name : ""}
        </>
    )
}

export default Header;