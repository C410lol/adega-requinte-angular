import { AddressType } from "./AddressType"
import { OrderProductType } from "./OrderProductType"
import { UserType } from "./UserType"

export type OrderType = {
    id: string,
    orderNumber: number,
    date: string,
    delivery: string,
    address?: AddressType,
    payment: string,
    exchange?: number,
    totalPrice: number,
    totalProducts: number,
    status: string,
    orderProducts: OrderProductType[],
    user: UserType
}