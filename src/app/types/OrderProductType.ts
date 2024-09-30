import { WineType } from "./WineType"

export type OrderProductType = {
    id: string,
    quantity: number,
    totalPrice: number,
    product: WineType
}