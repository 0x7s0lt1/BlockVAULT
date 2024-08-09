import { FC } from "react";
import PasswordType from "@/types/Items/PasswordType";

type Props = {
    item: PasswordType|null
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