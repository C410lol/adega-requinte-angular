import { Sort } from "./Sort"

export type ProductsFilter = {
   types: string[],
   categories: string[],
   countries: string[],
   classifications: string[],
   status?: string,
   hasProm?: boolean,
   sort: Sort
}