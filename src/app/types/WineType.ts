import { GrapeType } from "./GrapeType"

export type WineType = {
    id: string,
    name: string,
    description: string,
    type: string,
    country: string,
    classification: string,
    grapes: GrapeType[],
    size: string,
    quantity: number,
    currentPrice: number,
    regPrice: number,
    hasProm: boolean,
    promPercentage: number
    promPrice: number,
    images: string[],
    status: string
}