import { Page } from "../classes/Page"
import { Process } from "../classes/Process"

export interface MainContainerProps {
    memory: (Page | undefined)[]
    reference: Process[]
}