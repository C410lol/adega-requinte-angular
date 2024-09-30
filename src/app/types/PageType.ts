export type PageType<T> = {
    content: T[],
    totalPages: number,
    totalElements: number,
    number: number,
    empty: boolean
}