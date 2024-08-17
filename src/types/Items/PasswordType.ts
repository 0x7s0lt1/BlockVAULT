type PasswordType = {
    isOwn: boolean,
    name: string,
    url: string,
    user_name: string,
    password: string,
    address: string,
    restricted?: boolean,
}

export const isPasswordType = (value: any): value is PasswordType => {
    return (
        typeof value.isOwn === "boolean" &&
        typeof value.name === "string" &&
        typeof value.url === "string" &&
        typeof value.user_name === "string" &&
        typeof value.password === "string" &&
        typeof value.address === "string"
    )
}


export default PasswordType;