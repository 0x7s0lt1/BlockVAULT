type DepositType = {
    address: string
    amount: number
}

export const isDepositType = (obj: any): obj is DepositType => {
    return typeof obj.address === "string" && typeof obj.amount === "number";
}

export default DepositType;