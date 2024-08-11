type DebitCardType ={
    name: string
    card_id: string,
    name_on_card: string,
    expire_at: BigInt,
    cvv: BigInt,
    address: string,
}

export const isDebitCardType = (value: any): value is DebitCardType => {
    return (
        typeof value.name === "string" &&
        typeof value.card_id === "string" &&
        typeof value.name_on_card === "string" &&
        typeof value.expire_at === "bigint" &&
        typeof value.cvv === "bigint" &&
        typeof value.address === "string"
    )
}

export default DebitCardType;