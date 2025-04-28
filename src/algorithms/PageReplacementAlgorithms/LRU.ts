import { PageReplacementAlgorithm } from "../../types/PageReplacementAlgorithm";

export const LRU: PageReplacementAlgorithm = (newPage, memory, pageReference, index) => {
    for (let i = 0; i < memory.length; i++) {
        if (memory[i] && memory[i].address === newPage.address) {
            memory[i].lastUsedIndex = index;
            return [memory, pageReference];
        }
    }

    const emptyIndex = memory.findIndex(p => p === undefined);
    if (emptyIndex !== -1) {
        const newMemory = [...memory];
        newPage.lastUsedIndex = index;
        newMemory[emptyIndex] = newPage;
        return [newMemory, pageReference];
    }

    let oldestIndex = Infinity;
    let replaceIndex = 0;

    for (let i = 0; i < memory.length; i++) {
        const page = memory[i];
        if (page && page.lastUsedIndex < oldestIndex) {
            oldestIndex = page.lastUsedIndex;
            replaceIndex = i;
            }
    }

    const newMemory = [...memory];
    newPage.lastUsedIndex = index;
    newMemory[replaceIndex] = newPage;

    return [newMemory, pageReference];
};
