
import React, {FC, useEffect, useState} from "react";
import {Contract} from "ethers";

type Props = {
    vault: Contract | null
}
const Deposit : FC<Props> = ({vault}) => {

    return (
        <>
            <h2>Deposit</h2>
        </>
    )
}

export default Deposit;