import { FC } from "react";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item: LoyalityCardType|null
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