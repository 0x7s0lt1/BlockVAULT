import { FC } from "react";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item?: LoyalityCardType
}
const Header : FC<Props> = ({ item }) => {

    return (
        <>
            {item ? item.name : ""}
        </>
    )
}

export default Header;