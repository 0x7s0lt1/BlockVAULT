
import React, {FC, useEffect, useState} from "react";
import { UpcScan, PencilSquare, Trash } from 'react-bootstrap-icons';
import {Contract} from "ethers";
import LoyalityCardType from "@/types/Items/LoyalityCardType";

type Props = {
    item: LoyalityCardType,
    vault: Contract | null
}
const LoyalityCard: FC<Props> = ({item, vault}) => {

    return (
        <>
            <div className={"item-card loyality-card"}>

                <div className="item-card-body">
                    <h5 className="item-card-title">
                        {item.name}
                    </h5>
                    <span className="item-card-text">
                        {item.number}
                        <br/>
                    </span>
                    <a className={"item-card-text link-purple text-white text-decoration-none"}
                       href={`https://polygonscan.com/address/${item.address}`}>
                        <small>{item.address}</small>
                    </a>
                </div>
                <div className={"item-card-footer"}>
                    <button className="btn-hover btn-circle"><UpcScan/></button>
                    <button className="btn-hover btn-circle"><PencilSquare/></button>
                    <button className="btn-hover btn-circle"><Trash/></button>
                </div>

            </div>
        </>
    )
}

export default LoyalityCard;