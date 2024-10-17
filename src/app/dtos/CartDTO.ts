import { CartWineType } from "../types/CartWineType"

export type CartDTO = {
    cartProducts: CartWineType[],
    subtotal: number,
    total: number,
    hasMemberDiscount: boolean
}