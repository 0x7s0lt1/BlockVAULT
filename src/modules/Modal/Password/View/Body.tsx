import { FC } from "react";
import PasswordType from "@/types/Items/PasswordType";

type Props = {
    item: PasswordType|null
}
const Body : FC<Props> = ({ item }) => {

    return (
        <>
            <div>
                <h1 className={"text-barcode text-white"}>
                    {item ? item.password : ""}
                </h1>
                <span className={"text-white loy-card-number"}>
                    {item ? item.password : ""}
                </span>
            </div>
        </>
    )
}

export default Body;