import { FC } from "react";
import DebitCardType from "@/types/Items/DebitCardType";

type Props = {
    item: DebitCardType|null
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