import { Page } from "./Page"

export class Process {
    id: number
    weight: number
    pages: Page[]
    pagesLength: number

    constructor(id: number, weight: number, pages: Page[]) {
        this.id = id
        this.weight = weight
        this.pages = pages
        this.pagesLength = pages.length
    }
}