import { ReactNode, useEffect, useState } from "react"
import "./index.css"
import { Page } from "../../classes/Page"
import { useSimulation } from "../../contexts/SimulationContext"
import { Process } from "../../classes/Process"

const MemoryContainer = ({ children, memory, reference } : { children?: ReactNode[] | ReactNode, memory: (Page | undefined)[], reference: Process[] }) =>{
    const [colorCoefficient, setColorCoefficient] = useState(0)
    const { allocations } = useSimulation()
    
    useEffect(() =>{
        setColorCoefficient((40 / reference.length))
    }, [reference.length])

    return (
        <div className="memory-container">
            {children}
            <h2>Memory</h2>
            <div className="memory-cells">
                {memory.map((value, idx) =>{
                const intensity = (allocations[idx])/(reference.length)*255 //100 + (idx-allocations.length / 2 > 0 ? 1 : -1) * allocations[idx] * colorCoefficient

                return (
                        <div className="memory-cell" style={{ background:  /*(idx) > reference.length ? "transparent" :*/ `rgb(${intensity}, ${intensity}, 255)` }}>{
                            value 
                                ? value.address 
                                : "x"
                            }
                        </div>
                    )}
                )}
            </div>
        </div>
    )
}

export default MemoryContainer