import { FC } from "react";
import DebitCardType from "@/types/Items/DebitCardType";

type Props = {
    item: DebitCardType|null
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