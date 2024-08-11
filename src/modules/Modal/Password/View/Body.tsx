import { FC } from "react";
import PasswordType from "@/types/Items/PasswordType";

type Props = {
    item: PasswordType|null
}
const Body : FC<Props> = ({ item }) => {

    return (
        <>
            <div>
                <h1 className={"text-white"}>
                    <a target={"_blank"} href={item ? item.url : ""}  className={"text-white text-decoration-none link-purple"}>
                        {item ? item.url : ""}
                    </a>
                </h1>

                <div className={"psw-card-wrapper"}>
                     <span className={"text-white psw-card-user-name"}>
                        User name: &nbsp;<span className={"link-purple"}>{item ? item.user_name : ""}</span>
                     </span>
                    <span className={"text-white psw-card-pass"}>
                        Password:    &nbsp; &nbsp;<span className={"link-purple"}>{item ? item.password : ""}</span>
                     </span>
                </div>
            </div>
        </>
    )
}

export default Body;