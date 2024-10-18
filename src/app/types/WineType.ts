import { GrapeType } from "./GrapeType"

export type WineType = {
    id: string,
    name: string,
    description: string,
    type: string,
    category?: string,
    country?: string,
    classification?: string,
    size?: string,
    quantity: number,
    currentPrice: number,
    regPrice: number,
    memberPrice: number,
    hasProm: boolean,
    promPercentage?: number,
    promPrice?: number,
    status: string,
    images?: string[],
    grapes?: GrapeType[],
}