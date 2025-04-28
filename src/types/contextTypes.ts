import { Batch } from "./Batch"
import { FrameAllocationAlgorithm } from "./FrameAllocationAlgorithm"
import { HistoryElement } from "./HistoryElement"

export type SimulationContextType = {
    localityWindowSize: number
    setLocalityWindowSize: React.Dispatch<React.SetStateAction<number>> | undefined
    minLocalPages: number
    setMinLocalPages: React.Dispatch<React.SetStateAction<number>> | undefined
    maxLocalPages: number
    setMaxLocalPages: React.Dispatch<React.SetStateAction<number>> | undefined 
    speed: number
    setSpeed: React.Dispatch<React.SetStateAction<number>> | undefined
    batches: Batch[]
    setBatches: React.Dispatch<React.SetStateAction<Batch[]>> | undefined
    batchIndex: number,
    setBatchIndex: React.Dispatch<React.SetStateAction<number>> | undefined
    frameAllocationAlgorithm: FrameAllocationAlgorithm,
    setFrameAllocationAlgorithm: React.Dispatch<React.SetStateAction<FrameAllocationAlgorithm>> | undefined,
    history: HistoryElement[],
    setHistory: React.Dispatch<React.SetStateAction<HistoryElement[]>> | undefined,
    maxFrameCount: number,
    setMaxFrameCount: React.Dispatch<React.SetStateAction<number>> | undefined,
    allocations: number[]
    setAllocations: React.Dispatch<React.SetStateAction<number[]>> | undefined,
}

export type PagesContextType = {
    batchSize: number
    setBatchSize: React.Dispatch<React.SetStateAction<number>> | undefined
    pageFrameCount: number
    pageMaxCount: number
    pageReferenceLength: number
    setPageFrameCount: React.Dispatch<React.SetStateAction<number>> | undefined
    setPageMaxCount: React.Dispatch<React.SetStateAction<number>> | undefined
    setPageReferenceLength: React.Dispatch<React.SetStateAction<number>> | undefined
}