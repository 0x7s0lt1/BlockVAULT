
import React, {FC, useEffect, useState} from "react";
import {Contract} from "ethers";

type Props = {
    vault: Contract | null
}
const Debit : FC<Props> = ({vault}) => {

    return (
        <>
           <h2>Debit</h2>
        </>
    )
}

export default Debit;