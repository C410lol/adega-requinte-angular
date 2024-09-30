import { GrapeType } from "../types/GrapeType"

export type ProductDTO = {
    name: string,
    description: string,
    type: string,
    country: string,
    classification: string,
    size: string,
    quantity: number,
    regPrice: number,
    hasProm: boolean,
    promPrice: number,
    status: string,
    grapes: GrapeType[]
}