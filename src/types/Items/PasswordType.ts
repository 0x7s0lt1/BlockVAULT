type PasswordType = {
    name: string,
    url: string,
    user_name: string,
    password: string,
    address: string
}

export const isPasswordType = (value: any): value is PasswordType => {
    return (
        typeof value.name === "string" &&
        typeof value.url === "string" &&
        typeof value.user_name === "string" &&
        typeof value.password === "string" &&
        typeof value.address === "string"
    )
}


export default PasswordType;