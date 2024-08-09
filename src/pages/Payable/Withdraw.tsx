
import React, {FC, useEffect, useState} from "react";
import {Contract} from "ethers";

type Props = {
    vault: Contract | null
}
const Withdraw : FC<Props> = ({vault}) => {

    return (
        <>
            <h2>Withdraw</h2>
        </>
    )
}

export default Withdraw;