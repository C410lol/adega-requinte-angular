import { GrapeType } from "../types/GrapeType"

export type ProductDTO = {
    name: string,
    description: string,
    type: string,
    category?: string,
    country?: string,
    classification?: string,
    size?: string,
    quantity: number,
    regPrice: number,
    hasProm: boolean,
    promPrice?: number,
    status: string,
    images?: string[],
    grapes?: GrapeType[]
}