import { AddressDTO } from "./AddressDTO"
import { OrderProductDTO } from "./OrderProductDTO"

export type OrderDTO = {
    delivery: string,
    address?: AddressDTO,
    payment: string,
    exchange?: number,
    orderProducts: OrderProductDTO[]
}