import { FC } from "react";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item: LoyalityCardType|null
}
const Body : FC<Props> = ({ item }) => {

    return (
        <>
            <div className={"loyal-card"}>
                <h1 className={"text-barcode text-white"}>
                    {item ? item.number : ""}
                </h1>
            </div>
        </>
    )
}

export default Body;