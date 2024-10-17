import { WineType } from "./WineType"

export type CartWineType = {
    wine: WineType,
    quantity: number,
    subtotalPrice: number    
}