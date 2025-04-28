import { Page } from "../classes/Page"
import { Process } from "../classes/Process"
import { BASE_MAX_PROCESS_SIZE } from "../const/pageSettings"
import { Batch } from "../types/Batch"

export const generateBatches = (
    batchSize: number,
    pageFrameCount: number,
    pageMaxCount: number,
    pageReferenceLength: number,
    localityWindowSize: number,
    minLocalPages: number,
    maxLocalPages: number,
    maxFrameCount: number
): Batch[] => {
    const batches: Batch[] = []

    for (let b = 0; b < batchSize; b++) {
        const processReference: Process[] = []

        for(let p=0; p<maxFrameCount; p++) {
            const pageReference: Page[] = []
            const pagesCount = Math.floor(Math.random()*pageReferenceLength)

            let generated = 0
            while (generated < pagesCount) {
                const remaining = pagesCount - generated
                const windowSize = Math.min(localityWindowSize, remaining)

                const localPageCount = Math.floor(Math.random() * (maxLocalPages - minLocalPages + 1)) + minLocalPages
                const localPages: number[] = []

                for (let i = 0; i < localPageCount; i++) {
                    const pageNum = Math.floor(Math.random() * pageFrameCount)
                    if (!localPages.includes(pageNum)) {
                        localPages.push(pageNum)
                    }
                }

                for (let i = 0; i < windowSize; i++) {
                    const address = localPages[Math.floor(Math.random() * localPages.length)]
                    pageReference.push(new Page(address))
                }

                generated += windowSize
            }
            const weight = Math.floor(Math.random()*BASE_MAX_PROCESS_SIZE)
            processReference.push({
                id: p+1,
                pages: pageReference,
                pagesLength: maxFrameCount,
                weight,
            })
        }

        const memory: (Page | undefined)[] = Array(pageMaxCount).fill(undefined)

        batches.push({
            processReference,
            memory,
        })
    }

    return batches
}
