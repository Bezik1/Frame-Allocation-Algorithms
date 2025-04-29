import { Page } from "../../classes/Page";
import { FrameAllocationAlgorithm } from "../../types/FrameAllocationAlgorithm";
import { LRU } from "../PageReplacementAlgorithms/LRU";

export const PageFaultRateControl: FrameAllocationAlgorithm = 
(processReference, memory, indexes, pageFaultsCounts, oldAllocations, workingSets,) => {
    const activeProcesses = processReference.filter(p => p.pages.length > 0);
    const numActiveProcesses = activeProcesses.length;

    if (oldAllocations.length === 0) {
        const allocations = new Array<number>(memory.length).fill(0);
        const numProcesses = activeProcesses.length;
        const baseAllocation = Math.floor(memory.length / numProcesses);
        let remainder = memory.length % numProcesses;

        let memIndex = 0;
        activeProcesses.forEach(process => {
            const allocationCount = baseAllocation + (remainder > 0 ? 1 : 0);
            remainder--;

            for (let i = 0; i < allocationCount; i++) {
                allocations[memIndex++] = process.id;
            }
        });

        oldAllocations.push(...allocations);
    }

    if (numActiveProcesses === 0) {
        return [memory.map(() => undefined), oldAllocations, new Array(processReference.length).fill(0)];
    }

    const totalFaults = pageFaultsCounts.reduce(
        (sum, faults, idx) => (processReference[idx].pages.length > 0 ? sum + faults : sum),
        0
    ) || 1;

    const framesPerProcess = processReference.map((process, i) => {
        if (process.pages.length === 0) return 0;
        return Math.max(1, Math.floor((pageFaultsCounts[i] / totalFaults) * memory.length));
    });

    const pageFaults: number[] = new Array<number>(processReference.length).fill(0);
    const memoryCopy = [...memory];

    const potentialBackupIndicies: number[] = []
    for (let i = 0; i < processReference.length; i++) {
        const process = processReference[i];
        if (process.pages.length === 0) continue;

        const processOldMemoryIndicies = memory.map((_, idx) => oldAllocations[idx] == process.id ? idx : undefined).filter(el => el != undefined)
        const oldFramesAllocated = processOldMemoryIndicies.length
        let framesAllocated = framesPerProcess[i];

        console.log(processOldMemoryIndicies, framesPerProcess)
        if(oldFramesAllocated > framesAllocated) {
            for(let j=0; j<oldFramesAllocated-framesAllocated; j++) {
                const potentialIndex = processOldMemoryIndicies.shift()
                if(potentialIndex) potentialBackupIndicies.push(potentialIndex)
            }
        }
    }

    for (let i = 0; i < processReference.length; i++) {
        const process = processReference[i];
        if (process.pages.length === 0) continue;

        const processOldMemoryIndicies = memory.map((_, idx) => oldAllocations[idx] == process.id ? idx : undefined).filter(el => el != undefined)
        let framesAllocated = framesPerProcess[i];
        let subMemory: (Page | undefined)[] = memory.filter((_, idx) => oldAllocations[idx] == process.id)

        const newPage = process.pages.shift();
        if (!newPage) continue;

        pageFaults[i] += subMemory.findIndex(el => el?.address == newPage.address) == -1 ? 1 : 0;
        const [updatedMemory] = LRU(newPage, subMemory, [], indexes[i]);

        for (let j = 0; j < processOldMemoryIndicies.length; j++) {
            memoryCopy[processOldMemoryIndicies[j]] = updatedMemory[j];
            oldAllocations[processOldMemoryIndicies[j]] = process.id
            framesAllocated--
        }

        for(let j=0; j<framesAllocated; j++) {
            const allocatedIndex = potentialBackupIndicies.shift()
            if(allocatedIndex) oldAllocations[allocatedIndex] = process.id
        }

        const expiredProcesses = processReference.filter(process => process.pages.length === 0)
        const emptySlotsIndicies = oldAllocations.map((el, idx) => expiredProcesses.findIndex(e => e.id == el) != -1 ? idx : undefined).filter(el => el != undefined)
        emptySlotsIndicies.forEach((idx, l) =>{
            console.log(emptySlotsIndicies.length / processReference.length)
            if(l < (emptySlotsIndicies.length / activeProcesses.length))
                oldAllocations[idx] = process.id
        })
    }

    return [memoryCopy, oldAllocations, pageFaults];
};
