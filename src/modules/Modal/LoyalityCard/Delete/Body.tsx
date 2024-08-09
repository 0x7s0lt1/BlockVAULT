import { FC } from "react";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item: LoyalityCardType|null
}
const Body : FC<Props> = ({ item }) => {

    return (
        <>
            <div>
                <span className={"text-white loy-card-number"}>
                    { `Are you sure you want to delete ${item ? item.name : ""} ?` }
                </span>
            </div>
        </>
    )
}

export default Body;