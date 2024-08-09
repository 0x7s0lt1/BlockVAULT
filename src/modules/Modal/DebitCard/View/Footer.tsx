import { FC } from "react";
import DebitCardType from "@/types/Items/DebitCardType";

type Props = {
    item: DebitCardType|null
}
const Footer : FC<Props> = ({ item }) => {

    return (
        <>
            <p>
                <a target={"_blank"} href={"https://polygonscan.com/address/" + item?.address} className={"link-purple text-white text-decoration-none"}>
                    { item ? item.address : "" }
                </a>
            </p>
        </>
    )
}

export default Footer;