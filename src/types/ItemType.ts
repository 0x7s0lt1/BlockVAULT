export enum ItemType {
    LOYALITY_CARD = 0,
    DEBIT_CARD = 1,
    PASSWORD = 2
}

export const isItemType = (value: any): value is ItemType => {
    return Object.values(ItemType).includes(value);
}