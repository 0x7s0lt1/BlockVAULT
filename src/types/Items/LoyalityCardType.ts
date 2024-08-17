type LoyalityCardType ={
    isOwn: boolean,
    name: string
    number: string,
    address: string,
    restricted?: boolean,
}

export const isLoyalityCardType = (value: any): value is LoyalityCardType => {
    return (
        typeof value.isOwn === "boolean" &&
        typeof value.name === "string" &&
        typeof value.number === "string" &&
        typeof value.address === "string"
    )
}

export default LoyalityCardType;