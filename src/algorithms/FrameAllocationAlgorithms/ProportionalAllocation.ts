import { FrameAllocationAlgorithm } from "../../types/FrameAllocationAlgorithm";
import { LRU } from "../PageReplacementAlgorithms/LRU";

export const ProportionalAllocation: FrameAllocationAlgorithm = 
(processReference, memory, indexes, pageFaultsCounts, oldAllocations, workingSets,) => {

    const activeProcesses = processReference.filter(process => process.pages.length > 0);
    const numActiveProcesses = activeProcesses.length;

    if (numActiveProcesses === 0) {
        return [memory.map(() => undefined), new Array(memory.length).fill(0), new Array(processReference.length).fill(0)];
    }

    const totalWeight = activeProcesses.reduce((acc, process) => acc + process.weight, 0);

    const framesPerProcesses = processReference.map(process =>
        process.pages.length > 0 ? Math.max(1, Math.floor((process.weight / totalWeight) * memory.length)) : 0
    );

    const pageFaults: number[] = new Array<number>(processReference.length).fill(0);
    const allocations: number[] = new Array<number>(memory.length).fill(0);

    if (framesPerProcesses.some(v => v === 0 && processReference[framesPerProcesses.indexOf(v)].pages.length > 0)) {
        return [memory, allocations, pageFaults];
    }

    let memoryIndex = 0;
    const memoryCopy = [...memory];

    for (let i = 0; i < processReference.length; i++) {
        const process = processReference[i];

        if (process.pages.length === 0) continue;

        const framesAllocated = framesPerProcesses[i];
        const start = memoryIndex;
        const end = start + framesAllocated;

        const subMemory = memory.slice(start, end);
        const subReference = process.pages.slice(0, framesAllocated);

        const newPage = process.pages.shift();
        if (!newPage) continue;

        pageFaults[i] += subMemory.findIndex(el => el?.address == newPage.address) == -1 ? 1 : 0;
        const [updatedMemory] = LRU(newPage, subMemory, [], indexes[i]);

        for (let j = 0; j < framesAllocated && (start + j) < memoryCopy.length; j++) {
            memoryCopy[start + j] = updatedMemory[j];
            allocations[start + j] = i + 1;
        }

        memoryIndex = end;
    }

    return [memoryCopy, allocations, pageFaults];
};
