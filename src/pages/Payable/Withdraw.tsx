
import { FC } from "react";
import { Contract } from "ethers";
import WithdrawForm from "@/modules/Forms/Payable/WithdrawForm";

type Props = {
    fetchBalance: Function,
    vault: Contract | null
}
const Withdraw : FC<Props> = ({ balance, fetchBalance, vault }) => {

    return (
        <>
            <div className={"page-header"}>
                <div>
                    <h2 className={"page-title"}>Withdraw</h2>
                </div>
            </div>
            <div className={"page-body border-white"}>
                <WithdrawForm
                    balance={balance}
                    fetchBalance={fetchBalance}
                    vault={vault}
                />
            </div>
        </>
    )
}

export default Withdraw;