import { FrameAllocationAlgorithm } from "../../types/FrameAllocationAlgorithm";
import { LRU } from "../PageReplacementAlgorithms/LRU";

export const PageFaultRateControl: FrameAllocationAlgorithm = 
(processReference, memory, indexes, pageFaultsCounts, allocations, workingSets,) => {
    const activeProcesses = processReference.filter(p => p.pages.length > 0);
    const numActiveProcesses = activeProcesses.length;

    if (numActiveProcesses === 0) {
        return [memory.map(() => undefined), new Array(memory.length).fill(0), new Array(processReference.length).fill(0)];
    }

    const totalFaults = pageFaultsCounts.reduce((sum, faults, idx) => 
        processReference[idx].pages.length === 0 ? sum : sum + faults, 0
    ) || 1;

    const framesPerProcess = processReference.map((process, i) => {
        if (process.pages.length === 0) return 0;
        return Math.max(1, Math.floor((pageFaultsCounts[i] / totalFaults) * memory.length));
    });

    const pageFaults: number[] = new Array<number>(processReference.length).fill(0);
    let memoryIndex = 0;
    const memoryCopy = [...memory];

    for (let i = 0; i < processReference.length; i++) {
        const process = processReference[i];
        if (process.pages.length === 0) continue;

        const framesAllocated = framesPerProcess[i];
        const start = memoryIndex;
        const end = Math.min(memory.length, memoryIndex + framesAllocated);

        let subMemory = memoryCopy.slice(start, end);

        const newPage = process.pages.shift();
        if (!newPage) continue;

        pageFaults[i] += subMemory.find(el => el && el.address == newPage.address) !== undefined ? 1 : 0
        const [updatedMemory, _] = LRU(newPage, subMemory, [], indexes[i]);

        for (let j = 0; j < updatedMemory.length && (start + j) < memoryCopy.length; j++) {
            memoryCopy[start + j] = updatedMemory[j];
            allocations[start + j] = i + 1;
        }

        memoryIndex = end;
    }

    return [memoryCopy, allocations, pageFaults];
};
