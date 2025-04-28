import { Page } from "../classes/Page";

export interface PageReplacementAlgorithm {
    (newPage: Page, memory: (Page | undefined)[], pageReference: Page[], index: number): [(Page | undefined)[], Page[]]
}