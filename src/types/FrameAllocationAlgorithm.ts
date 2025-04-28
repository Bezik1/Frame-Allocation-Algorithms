import { Page } from "../classes/Page";
import { Process } from "../classes/Process";

export interface FrameAllocationAlgorithm {
    (processReference: Process[],
        memory: (Page | undefined)[],
        indexes: number[],
        pageFaultsCounts: number[],
        oldAlocations: number[],
        workingSets: number[][],
    ): [(Page | undefined)[], number[], number[]]
}