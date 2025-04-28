import { useEffect, useState } from "react"
import { Process } from "../../classes/Process"
import { HistoryElement } from "../../types/HistoryElement"
import "./index.css"
import { useSimulation } from "../../contexts/SimulationContext"

const InfoContainer = ({ pageFaultsCount, pageFaultsCounts, history, index, reference } : { pageFaultsCounts: number[], pageFaultsCount: number, history: HistoryElement[], index: number, reference: Process[] }) =>{
    const { setHistory } = useSimulation()
    const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0)
    
    useEffect(() =>{
        if(history.length > 4) {
            setCurrentHistoryIndex(0)
            setHistory([history[history.length-1]])
        }
    }, [history.length])

    return (
        <div className="info-container">
            <div className="info-content">
                <div className="info-lists">
                    <div className="global-page-fault">
                        <div className="process-el-property">Global Page Faults: </div>
                        <div className="process-el-value">{pageFaultsCount}</div>
                    </div>
                    <div className="page-faults">
                        {pageFaultsCounts.map((faults, idx) =>(
                            <div className="page-fault">
                                <div className="process-el">
                                    <div className="process-el-property">Process ID: </div>
                                    <div className="process-el-value">{idx+1}</div>
                                </div>
                                <div className="process-el">
                                    <div className="process-el-property">Page Faults: </div>
                                    <div className="process-el-value">{faults}</div>
                                </div>
                                <div className="process-el">
                                    <div className="process-el-property">Weight: </div>
                                    <div className="process-el-value">{reference[idx].weight}</div>
                                </div>
                            </div>
                        ))}
                        </div>
                        <button
                            className="reset-history-btn"
                            onClick={e => { setHistory([])}}
                        >
                            Reset History
                        </button>
                </div>
                {history.length > 0 ? <div className="info-lists limited">
                    <div className="global-page-fault">
                        <div className="process-el-property">Global Page Faults: </div>
                        <div className="process-el-value">{history[currentHistoryIndex].pageFaultCount}</div>
                    </div>
                    <div className="page-faults">
                        {history[currentHistoryIndex].processes.map((process, idx) =>(
                            <div className="page-fault">
                                <div className="process-el">
                                    <div className="process-el-property">Process ID: </div>
                                    <div className="process-el-value">{idx+1}</div>
                                </div>
                                <div className="process-el">
                                    <div className="process-el-property">Page Faults: </div>
                                    <div className="process-el-value">{process.pageFaults}</div>
                                </div>
                                <div className="process-el">
                                    <div className="process-el-property">Weight: </div>
                                    <div className="process-el-value">{process.weight}</div>
                                </div>
                            </div>
                        ))}
                        </div>
                        <select
                            className="custom-select detailed-select"
                            onChange={e => setCurrentHistoryIndex(Number.parseInt(e.target.value))}
                        >
                            {history.map((el, i) =>(
                                <option value={i}>{el.name}</option>
                            ))}
                        </select>
                </div> : <div className="none">History is Empty :((</div>}
            </div>
        </div>
    )
}

export default InfoContainer