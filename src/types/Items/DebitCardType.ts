type DebitCardType ={
    name: string
    card_id: string,
    name_on_card: string,
    expire_at: number,
    cvv: number,
    address: string,
}

export const isDebitCardType = (value: any): value is DebitCardType => {
    return (
        typeof value.name === "string" &&
        typeof value.card_id === "string" &&
        typeof value.name_on_card === "string" &&
        typeof value.expire_at === "number" &&
        typeof value.cvv === "number" &&
        typeof value.address === "string"
    )
}

export default DebitCardType;