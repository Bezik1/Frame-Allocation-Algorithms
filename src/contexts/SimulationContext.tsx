import { createContext, ReactNode, useContext, useState } from "react";
import { SimulationContextType } from "../types/contextTypes";
import { Batch } from "../types/Batch";
import { BASE_LOCALITY_WINDOW_SIZE, BASE_PROCESSES_COUNT, BASE_SIMULATION_SPEED, MAX_LOCALITY_PAGES, MIN_LOCALITY_PAGES } from "../const/pageSettings";
import { HistoryElement } from "../types/HistoryElement";
import { EqualAllocation } from "../algorithms/FrameAllocationAlgorithms/EqualAllocation";
import { FrameAllocationAlgorithm } from "../types/FrameAllocationAlgorithm";

const SimulationContext = createContext<SimulationContextType>({
    speed: BASE_SIMULATION_SPEED,
    localityWindowSize: BASE_LOCALITY_WINDOW_SIZE,
    setLocalityWindowSize: undefined,
    minLocalPages: MIN_LOCALITY_PAGES,
    setMinLocalPages: undefined,
    maxLocalPages: MAX_LOCALITY_PAGES,
    setMaxLocalPages: undefined,
    setSpeed: undefined,
    batches: [],
    setBatches: undefined,
    batchIndex: 0,
    setBatchIndex: undefined,
    frameAllocationAlgorithm: EqualAllocation,
    setFrameAllocationAlgorithm: undefined,
    history: [],
    setHistory: undefined,
    maxFrameCount: BASE_PROCESSES_COUNT,
    setMaxFrameCount: undefined,
    allocations: [],
    setAllocations: undefined
})

export const SimulationProvider = ({ children } : { children?: ReactNode | ReactNode[] }) =>{
    const [batches, setBatches] = useState<Batch[]>([])
    const [batchIndex, setBatchIndex] = useState(0)
    const [frameAllocationAlgorithm, setFrameAllocationAlgorithm] = useState<FrameAllocationAlgorithm>(() => EqualAllocation)
    const [speed, setSpeed] = useState(BASE_SIMULATION_SPEED)
    const [history, setHistory] = useState<HistoryElement[]>([])
    const [localityWindowSize, setLocalityWindowSize] = useState(BASE_LOCALITY_WINDOW_SIZE)
    const [minLocalPages, setMinLocalPages] = useState(MIN_LOCALITY_PAGES)
    const [maxLocalPages, setMaxLocalPages] = useState(MAX_LOCALITY_PAGES)
    const [maxFrameCount, setMaxFrameCount] = useState(BASE_PROCESSES_COUNT)
    const [allocations, setAllocations] = useState<number[]>([])

    return (
        <SimulationContext.Provider value={{
            minLocalPages,
            setMinLocalPages,
            maxLocalPages,
            setMaxLocalPages,
            batches,
            setBatches,
            batchIndex,
            setBatchIndex,
            frameAllocationAlgorithm,
            setFrameAllocationAlgorithm,
            speed,
            setSpeed,
            history,
            setHistory,
            localityWindowSize,
            setLocalityWindowSize,
            maxFrameCount,
            setMaxFrameCount,
            allocations,
            setAllocations,
        }}>
            {children}
        </SimulationContext.Provider>
    )
}

export const useSimulation = () =>{
    const {
        history,
        setHistory,
        batches,
        speed,
        setSpeed,
        setBatches,
        batchIndex,
        setBatchIndex,
        frameAllocationAlgorithm,
        setFrameAllocationAlgorithm,
        localityWindowSize,
        setLocalityWindowSize,
        maxLocalPages,
        minLocalPages,
        setMaxLocalPages,
        setMinLocalPages,
        maxFrameCount,
        setMaxFrameCount,
        allocations,
        setAllocations,
    } = useContext(SimulationContext)

    if( typeof setBatches === "undefined" ||
        typeof setBatchIndex === "undefined" ||
        typeof setFrameAllocationAlgorithm === "undefined" ||
        typeof setSpeed === "undefined" ||
        typeof setHistory === "undefined" ||
        typeof setLocalityWindowSize === "undefined" ||
        typeof setMinLocalPages === "undefined" || 
        typeof setMaxLocalPages === "undefined" ||
        typeof setMaxFrameCount === "undefined" ||
        typeof setAllocations === "undefined"
    ) throw new Error("Element is outside of Simulation Context!")

    return {
        batches,
        history,
        speed,
        setHistory,
        setSpeed,
        setBatches,
        batchIndex,
        setBatchIndex,
        frameAllocationAlgorithm,
        setFrameAllocationAlgorithm,
        localityWindowSize,
        setLocalityWindowSize,
        maxLocalPages,
        minLocalPages,
        setMaxLocalPages,
        setMinLocalPages,
        maxFrameCount,
        setMaxFrameCount,
        allocations,
        setAllocations,
    }
}