import { FC } from "react";
import PasswordType from "@/types/Items/PasswordType";

type Props = {
    item: PasswordType|null
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