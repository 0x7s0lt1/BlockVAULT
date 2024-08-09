type WithdrawType = {
    address: string
    amount: number
}

export const isWithdrawType = (obj: any): obj is WithdrawType => {
    return typeof obj.address === "string" && typeof obj.amount === "number";
}

export default WithdrawType;