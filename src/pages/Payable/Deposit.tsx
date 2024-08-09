
import { FC } from "react";
import { Contract } from "ethers";
import DepositForm from "@/modules/Forms/Payable/DepositForm";

type Props = {
    fetchBalance: Function,
    vault: Contract | null
}
const Deposit : FC<Props> = ({fetchBalance, vault}) => {

    return (
        <>
            <div className={"page-header"}>
                <div>
                    <h2 className={"page-title"}>Deposit</h2>
                </div>
            </div>
            <div className={"page-body border-white"}>
                <DepositForm
                    fetchBalance={fetchBalance}
                    vault={vault}
                />
            </div>
        </>
    )
}

export default Deposit;