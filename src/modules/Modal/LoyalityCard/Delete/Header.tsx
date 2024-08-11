import { FC } from "react";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item: LoyalityCardType|null
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