import { Page } from "../../classes/Page";
import { FrameAllocationAlgorithm } from "../../types/FrameAllocationAlgorithm";
import { LRU } from "../PageReplacementAlgorithms/LRU";

export const EqualAllocation: FrameAllocationAlgorithm = 
    (processReference, memory, indexes, pageFaultsCounts, oldAllocations, workingSets,) => {

    const numActiveProcesses = processReference.filter(process => process.pages.length > 0).length;
    const framesPerProcess = Math.floor(memory.length / numActiveProcesses);

    let i = 0;
    let memoryIndex = 0;
    
    const pageFaults: number[] = new Array<number>(processReference.length).fill(0)
    const allocations: number[] = new Array<number>(memory.length).fill(0);
    if(framesPerProcess == 0) return [memory, allocations, pageFaults]

    while (i < processReference.length) {
        const process = processReference[i];

        if (process.pages.length === 0) {
            i++;
            continue;
        }

        let subReference: Page[] = [];
        let subMemory: (Page | undefined)[] = [];
        
        const start = memoryIndex;

        for (let j = 0;j < framesPerProcess && memoryIndex < memory.length; j++) {
            subReference.push(process.pages[j]);
            subMemory.push(memory[memoryIndex]);
            memoryIndex++;
        }

        const newPage = process.pages.shift();

        if (!newPage) {
            i++;
            continue;
        }

        pageFaults[i] += subMemory.findIndex(el => el?.address == newPage.address) == -1 ? 1 : 0;
        const [updatedMemory] = LRU(newPage, subMemory, [], indexes[i]);

        const newMemory = [...memory];
        newMemory.splice(start, framesPerProcess, ...updatedMemory.slice(0, framesPerProcess));

        memory = newMemory;
        
        allocations.fill(i + 1, start, start+framesPerProcess);

        i++;
    }

    if (numActiveProcesses === 0) return [memory.map(el => undefined), allocations, pageFaults];
    return [memory, allocations, pageFaults];
};
