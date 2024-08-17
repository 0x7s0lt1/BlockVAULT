export enum ItemType {
    LOYALITY_CARD = 0,
    DEBIT_CARD = 1,
    PASSWORD = 2
}

export const ItemTypeToReadableMap = new Map<number, string>([
    [0, "Loyality"],
    [1, "Debit"],
    [2, "Password"],
]);

export const isItemType = (value: any): value is ItemType => {
    return Object.values(ItemType).includes(value);
}