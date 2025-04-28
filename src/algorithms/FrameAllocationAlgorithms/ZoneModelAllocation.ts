import { FrameAllocationAlgorithm } from "../../types/FrameAllocationAlgorithm";
import { LRU } from "../PageReplacementAlgorithms/LRU";

const WINDOW_SIZE = 10;

export const ZoneModelAllocation: FrameAllocationAlgorithm = (
    processReference,
    memory,
    indexes,
    pageFaultsCounts,
    oldAllocations,
    workingSets,
) => {
    const activeProcesses = processReference.filter(p => p.pages.length > 0);

    if (activeProcesses.length === 0) {
        return [
            memory.map(() => undefined),
            new Array(memory.length).fill(0),
            new Array(processReference.length).fill(0),
        ];
    }

    const pageFaults = new Array<number>(processReference.length).fill(0);
    const memoryCopy = [...memory];
    const updatedAllocations = [...oldAllocations];
    let memoryIndex = 0;

    let potentialBackupSlots = 0;
    let potentialDesiredSlots = 0;

    processReference.forEach((process, i) => {
        if (process.pages.length === 0) {
            potentialBackupSlots += oldAllocations.reduce((state, el) => el == process.id ? state+1 : state, 0)
            return;
        };
        const newPage = process.pages[0];

        let isInWorkingSet = workingSets[i].includes(newPage.address);

        if (workingSets[i].length < WINDOW_SIZE) {
            workingSets[i].push(newPage.address);
        } else if (!isInWorkingSet) {
            workingSets[i].shift();
            workingSets[i].push(newPage.address);
        }

        const allocatedFrames = oldAllocations.filter(id => id === process.id).length;
        const subMemory = memoryCopy.slice(memoryIndex, memoryIndex + allocatedFrames);

        if (isInWorkingSet && subMemory.some(page => page?.address === newPage.address) && allocatedFrames > 1) {
            potentialBackupSlots++;
        } else if (!isInWorkingSet) {
            potentialDesiredSlots++;
        }
    });

    let slotsToReplace = Math.max(potentialBackupSlots - potentialDesiredSlots, 0);

    processReference.forEach((process, i) => {
        if (process.pages.length === 0) return;
        const emptySlots = memoryCopy.reduce((sum, slot) => sum + (slot === undefined ? 1 : 0), 0);
        
        const prevAllocatedFrames = oldAllocations.filter(id => id === process.id).length;
        const additionalSlot = slotsToReplace+emptySlots > 0 ? 1 : 0;
        const allocatedFrames = Math.max(1, prevAllocatedFrames + additionalSlot);
        if (slotsToReplace > 0) slotsToReplace--;

        let goLeft = memoryIndex + allocatedFrames > memory.length;
        let start = memoryIndex;
        let end = goLeft ? Math.max(0, memoryIndex - allocatedFrames) : Math.min(memory.length, memoryIndex + allocatedFrames);
        
        let realStart = Math.min(start, end);
        let realEnd = Math.max(start, end);
        
        let subMemory = memoryCopy.slice(realStart, realEnd);

        if(allocatedFrames > 0) {
            const newPage = process.pages.shift();
            if (!newPage) return;

            pageFaults[i] += subMemory.find(el => el && el.address == newPage.address) !== undefined ? 1 : 0

            const [updatedMemory] = LRU(newPage, subMemory, [], indexes[i]);

            if (!goLeft) {
                for (let j = 0; j < updatedMemory.length && (realStart + j) < memoryCopy.length; j++) {
                    memoryCopy[realStart + j] = updatedMemory[j];
                    updatedAllocations[realStart + j] = process.id;
                }
            } else {
                for (let j = 0; j < updatedMemory.length && (realEnd - 1 - j) >= 0; j++) {
                    memoryCopy[realEnd - 1 - j] = updatedMemory[j];
                    updatedAllocations[realEnd - 1 - j] = process.id;
                }
            }

            memoryIndex = end;
        } else throw new Error("Cannot execute process page if the allocated frame count is 0!")
    });

    return [memoryCopy, updatedAllocations, pageFaults];
};
