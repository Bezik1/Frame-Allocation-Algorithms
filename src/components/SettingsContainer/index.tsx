import { useState } from "react"
import { EqualAllocation } from "../../algorithms/FrameAllocationAlgorithms/EqualAllocation"
import { PageFaultRateControl } from "../../algorithms/FrameAllocationAlgorithms/PageFaultRateControl"
import { ProportionalAllocation } from "../../algorithms/FrameAllocationAlgorithms/ProportionalAllocation"
import { ZoneModelAllocation } from "../../algorithms/FrameAllocationAlgorithms/ZoneModelAllocation"
import { BASE_LOCALITY_WINDOW_SIZE, BASE_MAX_LOCALITY_PAGES, BASE_MAX_PROCESS_SIZE, BASE_MIN_LOCALITY_PAGES, BASE_PAGE_FRAME_COUNT, BASE_PAGE_MAX_COUNT, BASE_PAGE_REFERENCE_LENGTH, BASE_PROCESSES_COUNT, BASE_SIMULATION_SPEED, SLOW_LOCALITY_WINDOW_SIZE, SLOW_MAX_LOCALITY_PAGES, SLOW_MAX_PROCESS_SIZE, SLOW_MIN_LOCALITY_PAGES, SLOW_PAGE_FRAME_COUNT, SLOW_PAGE_MAX_COUNT, SLOW_PAGE_REFERENCE_LENGTH, SLOW_PROCESSES_COUNT, SLOW_SIMULATION_SPEED } from "../../const/pageSettings"
import { usePageSettings } from "../../contexts/PageSettingsContext"
import { useSimulation } from "../../contexts/SimulationContext"
import "./index.css"

const SettingsContainer =  ({ simulate, reset, simulation } : { simulate: () => void, reset: () => void, simulation: boolean }) =>{
    const {
        batchIndex,
        setBatchIndex,
        speed,
        setSpeed,
        setFrameAllocationAlgorithm,
        localityWindowSize,
        setLocalityWindowSize,
        maxLocalPages,
        minLocalPages,
        setMaxLocalPages,
        setMinLocalPages,
        maxFrameCount,
        setMaxFrameCount,
    } = useSimulation()
    const {
        batchSize,
        pageFrameCount,
        pageMaxCount,
        pageReferenceLength,
        setBatchSize,
        setPageFrameCount,
        setPageMaxCount,
        setPageReferenceLength,
    } = usePageSettings()
    const [fast, setFast] = useState(true)

    const changeFrameAllocationAlgorithm = (e: React.ChangeEvent<HTMLSelectElement>) =>{
        const selected = e.target.value;
        switch (selected) {
            case "EqualAllocation": setFrameAllocationAlgorithm(() => EqualAllocation); break;
            case "ProportionalAllocation": setFrameAllocationAlgorithm(() => ProportionalAllocation); break
            case "PageFaultRateControlAllocation": setFrameAllocationAlgorithm(() => PageFaultRateControl); break
            case "ZoneModelAllocation": setFrameAllocationAlgorithm(() => ZoneModelAllocation); break
            default: setFrameAllocationAlgorithm(() => EqualAllocation); break;
        }
    }

    const setSlowAnimation = () =>{
        setFast(false)
        setPageFrameCount(SLOW_PAGE_FRAME_COUNT)
        setPageMaxCount(SLOW_PAGE_MAX_COUNT)
        setPageReferenceLength(SLOW_PAGE_REFERENCE_LENGTH)
        setLocalityWindowSize(SLOW_LOCALITY_WINDOW_SIZE)
        setSpeed(SLOW_SIMULATION_SPEED)
        setMaxFrameCount(SLOW_PROCESSES_COUNT)
        setMinLocalPages(SLOW_MIN_LOCALITY_PAGES)
        setMaxLocalPages(SLOW_MAX_LOCALITY_PAGES)
    }

    const setFastAnimation = () =>{
        setFast(true)
        setPageFrameCount(BASE_PAGE_FRAME_COUNT)
        setPageMaxCount(BASE_PAGE_MAX_COUNT)
        setPageReferenceLength(BASE_PAGE_REFERENCE_LENGTH)
        setLocalityWindowSize(BASE_LOCALITY_WINDOW_SIZE)
        setSpeed(BASE_SIMULATION_SPEED)
        setMaxFrameCount(BASE_PROCESSES_COUNT)
        setMinLocalPages(BASE_MIN_LOCALITY_PAGES)
        setMaxLocalPages(BASE_MAX_LOCALITY_PAGES)
    }


    return (
        <div className="settings-container container">
            <div className="menu-els">
                <h1>Settings</h1>
                <div className="menu-el">
                    <div className="menu-el-title">Batch Index: </div>
                    <div className="menu-el-sub">
                        <input
                            type="range"
                            value={batchIndex}
                            min={1}
                            max={batchSize-1}
                            step={1}
                            className="menu-el-input"
                            onChange={e => setBatchIndex(Number(e.target.value))}
                        />
                        <div className="menu-el-value">{batchIndex}</div>
                    </div>
                </div>
                <div className="menu-el">
                    <div className="menu-el-title">Batch Size: </div>
                    <div className="menu-el-sub">
                        <input
                            type="range"
                            value={batchSize}
                            min={1}
                            max={100}
                            step={1}
                            className="menu-el-input"
                            onChange={e => setBatchSize(Number(e.target.value))}
                        />
                        <div className="menu-el-value">{batchSize}</div>
                    </div>
                </div>
                <div className="menu-el">
                    <div className="menu-el-title">Memory Size: </div>
                    <div className="menu-el-sub">
                        <input
                            type="range"
                            value={pageMaxCount}
                            min={1}
                            max={100}
                            step={1}
                            className="menu-el-input"
                            onChange={e => setPageMaxCount(Number(e.target.value))}
                        />
                        <div className="menu-el-value">{pageMaxCount}</div>
                    </div>
                </div>
                <div className="menu-el">
                    <div className="menu-el-title">Max Address Count: </div>
                    <div className="menu-el-sub">
                        <input
                            type="range"
                            value={pageFrameCount}
                            min={1}
                            max={100}
                            step={1}
                            className="menu-el-input"
                            onChange={e => setPageFrameCount(Number(e.target.value))}
                        />
                        <div className="menu-el-value">{pageFrameCount}</div>
                    </div>
                </div>
                <div className="menu-el">
                    <div className="menu-el-title">Max Frame Count: </div>
                    <div className="menu-el-sub">
                        <input
                            type="range"
                            value={pageReferenceLength}
                            min={1}
                            max={2500}
                            step={1}
                            className="menu-el-input"
                            onChange={e => setPageReferenceLength(Number(e.target.value))}
                        />
                        <div className="menu-el-value">{pageReferenceLength}</div>
                    </div>
                </div>
                <div className="menu-el">
                    <div className="menu-el-title">Process Count: </div>
                    <div className="menu-el-sub">
                        <input
                            type="range"
                            value={maxFrameCount}
                            min={1}
                            max={100}
                            step={1}
                            className="menu-el-input"
                            onChange={e => setMaxFrameCount(Number(e.target.value))}
                        />
                        <div className="menu-el-value">{maxFrameCount}</div>
                    </div>
                </div>
                <div className="menu-el">
                    <div className="menu-el-title">Locality Window Size: </div>
                    <div className="menu-el-sub">
                        <input
                            type="range"
                            value={localityWindowSize}
                            min={1}
                            max={500}
                            step={1}
                            className="menu-el-input"
                            onChange={e => setLocalityWindowSize(Number(e.target.value))}
                        />
                        <div className="menu-el-value">{localityWindowSize}</div>
                    </div>
                </div>
                <div className="menu-el top">
                    <div className="menu-el-title">Maximum Locality Pages: </div>
                    <div className="menu-el-sub">
                        <input
                            type="range"
                            value={maxLocalPages}
                            min={1}
                            max={100}
                            step={1}
                            className="menu-el-input"
                            onChange={e => setMaxLocalPages(Number(e.target.value))}
                        />
                        <div className="menu-el-value">{maxLocalPages}</div>
                    </div>
                </div>
                <div className="menu-el top">
                    <div className="menu-el-title">Minimal Locality Pages: </div>
                    <div className="menu-el-sub">
                        <input
                            type="range"
                            value={minLocalPages}
                            min={1}
                            max={100}
                            step={1}
                            className="menu-el-input"
                            onChange={e => setMinLocalPages(Number(e.target.value))}
                        />
                        <div className="menu-el-value">{minLocalPages}</div>
                    </div>
                </div>
                <div className="menu-el top">
                    <div className="menu-el-title">Simulation Speed: </div>
                    <div className="menu-el-sub">
                        <input
                            type="range"
                            value={speed}
                            min={0.1}
                            max={20}
                            step={0.5}
                            className="menu-el-input"
                            onChange={e => setSpeed(Number(e.target.value))}
                        />
                        <div className="menu-el-value">{speed}</div>
                    </div>
                </div>
                <div className="menu-el top">
                    <div className="menu-el-title">Select Algorithm:</div>
                    <div className="menu-el-sub">
                        <select
                            className="custom-select"
                            onChange={e => changeFrameAllocationAlgorithm(e)}
                        >
                            <option value="EqualAllocation">Equal Allocation</option>
                            <option value="ProportionalAllocation">Proportional Allocation</option>
                            <option value="PageFaultRateControlAllocation">Page Fault Rate Control Allocation</option>
                            <option value="ZoneModelAllocation">Zone Model Allocation</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="btns-container">
                <div className="modes">
                    <button 
                        className={`simulate-btn small-btn ${!fast && "simulate-btn-active"}`} 
                        onClick={setSlowAnimation}
                    >
                        Slow
                    </button>
                    <button 
                        className={`simulate-btn small-btn ${fast && "simulate-btn-active"}`} 
                        onClick={setFastAnimation}
                    >
                        Fast
                    </button>
                </div>
                <div className="menu-el single-el">
                    <button 
                        className={`simulate-btn ${simulation && "simulate-btn-active"}`} 
                        onClick={simulate}
                    >
                        {simulation ? "Stop" : "Simulate"}
                    </button>
                </div>
                <div className="menu-el single-el">
                    <button 
                        className={`simulate-btn`} 
                        onClick={reset}
                    >
                        Reset Batch
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SettingsContainer