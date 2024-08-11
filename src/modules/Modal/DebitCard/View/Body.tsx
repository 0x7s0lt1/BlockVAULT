import { FC } from "react";
import DebitCardType from "@/types/Items/DebitCardType";

type Props = {
    item: DebitCardType|null
}
const Body : FC<Props> = ({ item }) => {

    return (
        <>
            <div className={"deb-card"}>
                <h1 className={"text-barcode text-white"}>
                    {item ? item.number : ""}
                </h1>
                <p className={"text-white deb-card-number"}>
                    {item ? item.card_id : ""}
                </p>
                <p className={"text-white deb-card-name"}>
                    {item ? item.name_on_card : ""}
                </p>
                <div className={"deb-card-wrapper"}>
                    <span className={"text-white deb-card-expire"}>
                        {item ? item.expire_at.toString().slice(0,2) + "/" + item.expire_at.toString().slice(2,4) : ""}
                    </span>
                    <span className={"text-white deb-card-cvv"}>
                        {item ? "CVV: " + item.cvv.toString() : ""}
                    </span>
                </div>
            </div>
        </>
    )
}

export default Body;