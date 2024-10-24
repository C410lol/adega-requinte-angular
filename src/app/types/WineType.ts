import { CountryType } from "./CountryType"
import { GrapeType } from "./GrapeType"
import { HarmonizationType } from "./HarmonizationType"

export type WineType = {
    id: string,
    name: string,
    description: string,


    type: string,
    category?: string,
    country?: CountryType,
    classification?: string,
    harmonizationTags: HarmonizationType[],


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