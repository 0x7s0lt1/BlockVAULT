import { FC } from "react";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item: LoyalityCardType|null
}
const Body : FC<Props> = ({ item }) => {

    return (
        <>
            <div>
                <h1 className={"text-barcode text-white"}>
                    {item ? item.number : ""}
                </h1>
                <span className={"text-white loy-card-number"}>
                    {item ? item.number : ""}
                </span>
            </div>
        </>
    )
}

export default Body;