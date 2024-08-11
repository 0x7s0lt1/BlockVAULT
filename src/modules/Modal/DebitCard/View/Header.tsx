import { FC } from "react";
import DebitCardType from "@/types/Items/DebitCardType";
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { CHAINS } from "@/types/Utils";

type Props = {
    item: DebitCardType|null
}
const Header : FC<Props> = ({ item }) => {

    const { address, chainId, isConnected } = useWeb3ModalAccount();

    return (
        <>
            <h3>{item ? item.name : ""}</h3>
            <p>
                <a target={"_blank"} href={ (CHAINS.get(chainId)?.explorerUrl ?? "" ) + "/address/" + item?.address}
                   className={"link-purple text-white text-decoration-none"}>
                    {item ? item.address : ""}
                </a>
            </p>
        </>
    )
}

export default Header;