import { GrapeType } from "../types/GrapeType"
import { HarmonizationType } from "../types/HarmonizationType"

export type ProductDTO = {
    name: string,
    description: string,


    type: string,
    category?: string,
    classification?: string,
    countryId?: string,
    harmonizations?: HarmonizationType[], 


    size?: string,
    grapes?: GrapeType[],


    quantity: number,
    regPrice: number,
    hasProm: boolean,
    promPrice?: number,
    status: string,
    images?: string[],
}