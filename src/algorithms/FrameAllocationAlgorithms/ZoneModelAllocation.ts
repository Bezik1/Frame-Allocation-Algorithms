import { FrameAllocationAlgorithm } from "../../types/FrameAllocationAlgorithm";
import { LRU } from "../PageReplacementAlgorithms/LRU";

export const ZoneModelAllocation: FrameAllocationAlgorithm = (
    processReference,
    memory,
    indexes,
    pageFaultsCounts,
    oldAllocations,
    workingSets,
) => {
    const WINDOW_SIZE = 10;
    const activeProcesses = processReference.filter(p => p.pages.length > 0);
    
    if(oldAllocations.length === 0) {
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

    let potentialBackupSlots: number[] = [];
    let potentialDesiredSlots: number[] = [];

    processReference.forEach((process, i) => {
        if (process.pages.length === 0) return;

        const newPage = process.pages[0];
        const isInWorkingSet = workingSets[i].includes(newPage.address);

        if (!isInWorkingSet) {
            if (workingSets[i].length >= WINDOW_SIZE) {
                workingSets[i].shift();
            }
            workingSets[i].push(newPage.address);
        }

        const subMemory = memoryCopy.filter((_, idx) => updatedAllocations[idx] === process.id);

        if (isInWorkingSet && subMemory.some(page => page?.address === newPage.address)) {
            potentialBackupSlots.push(process.id);
        } else if (!isInWorkingSet) {
            potentialDesiredSlots.push(process.id);
        }
    });

    let slotsToReplace = Math.min(potentialDesiredSlots.length, potentialBackupSlots.length);

    processReference.forEach((process, i) => {
        if (process.pages.length === 0) return;

        const emptySlotIndex = memoryCopy.findIndex(slot => slot === undefined);
        const prevAllocatedFrames = updatedAllocations.filter(id => id === process.id).length;

        let addSlot = false;
        if (slotsToReplace > 0 || emptySlotIndex !== -1) {
            addSlot = true;
        }

        let allocatedFrames = prevAllocatedFrames + (addSlot ? 1 : 0);

        if (addSlot && slotsToReplace > 0) slotsToReplace--;

        if (addSlot) {
            const currentDesiredIdx = potentialDesiredSlots.indexOf(process.id);
            if (currentDesiredIdx !== -1) {
                potentialDesiredSlots.splice(currentDesiredIdx, 1);
            }

            const backupProcessId = potentialBackupSlots.shift();
            if (backupProcessId !== undefined) {
                const idx = updatedAllocations.findIndex(id => id === backupProcessId);
                if (idx !== -1) updatedAllocations[idx] = process.id;
            } else if (emptySlotIndex !== -1) {
                updatedAllocations[emptySlotIndex] = process.id;
            }
        }

        let outdatedSlots: number[] = [];

        processReference.forEach((process) => {
            if (process.pages.length === 0) {
                memoryCopy.forEach((_, idx) => {
                    if (updatedAllocations[idx] === process.id) {
                        outdatedSlots.push(idx);
                    }
                });
            }
        });

        outdatedSlots.forEach(_ =>{
            const slotIdx = outdatedSlots.shift();
            if (slotIdx !== undefined) {
                updatedAllocations[slotIdx] = process.id;
            }
        })

        const subMemoryIndexes = memoryCopy
            .map((_, idx) => updatedAllocations[idx] === process.id ? idx : undefined)
            .filter((el): el is number => el !== undefined);

        const subMemory = subMemoryIndexes.map(idx => memoryCopy[idx]);
        
        if (allocatedFrames > 0) {
            const newPage = process.pages.shift();
            if (!newPage) return;
            
            pageFaults[i] += subMemory.findIndex(el => el?.address == newPage.address) == -1 ? 1 : 0;
            const [updatedPages] = LRU(newPage, subMemory, [], indexes[i]);

            subMemoryIndexes.forEach((idx, j) => {
                memoryCopy[idx] = updatedPages[j];
                updatedAllocations[idx] = process.id;
            });
        } else {
            throw new Error(`Process ${process.id} has 0 allocated frames and cannot proceed.`);
        }
    });

    // Tests
    if(memory.length !== memoryCopy.length) throw new Error("Memory Size Changed!")

    processReference.forEach((process, _) =>{
        if(process.pages.length > 0 && !updatedAllocations.some(el => el === process.id))
            throw new Error("Process does not have memory amplified to it!")
    })

    return [memoryCopy, updatedAllocations, pageFaults];
};
