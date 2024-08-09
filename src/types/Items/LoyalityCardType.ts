type LoyalityCardType ={
    name: string
    number: string,
    address: string,
}

export const isLoyalityCardType = (value: any): value is LoyalityCardType => {
    return (
        typeof value.name === "string" &&
        typeof value.number === "string" &&
        typeof value.address === "string"
    )
}

export default LoyalityCardType;