import { FC } from "react";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item: LoyalityCardType|null
}
const Header : FC<Props> = ({ item }) => {

    return (
        <>
            {`Delete ${item ? item.name : ""}`}
        </>
    )
}

export default Header;