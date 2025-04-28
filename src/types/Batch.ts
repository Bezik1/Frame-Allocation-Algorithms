import { Page } from "../classes/Page"
import { Process } from "../classes/Process"

export type Batch = {
    processReference: Process[]
    memory: (Page | undefined)[]
}