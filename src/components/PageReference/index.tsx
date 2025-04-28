import { ReactNode, useEffect, useState } from "react"
import { Page } from "../../classes/Page"
import "./index.css"
import { Process } from "../../classes/Process"
import { useSimulation } from "../../contexts/SimulationContext"

const PageReference = ({ children, reference } : { children?: ReactNode | ReactNode[], reference: Process[] }) =>{
    const [colorCoefficient, setColorCoefficient] = useState(0)
    const { allocations } = useSimulation()
    
    useEffect(() =>{
        setColorCoefficient((40 / reference.length))
    }, [reference.length])
    
    return (
        <div className="page-reference">
            {children}
            <h2>Reference</h2>
            <div className="refs">
                {reference.map((processRef, idx) =>{
                    const intensity = (idx+1)/(reference.length)*255 //100 + (idx-reference.length / 2 > 0 ? 1 : -1) * (idx+1) * colorCoefficient
                    return (
                        <div className="ref" style={{ background: `rgb(${intensity}, ${intensity}, 255)` }}>
                            <div className="ref-properies">
                                <div className="ref-id">{processRef.id}</div>
                                <div className="ref-page-len">{processRef.pages.length}</div>
                                <div className="ref-page-len">{processRef.weight}</div>
                            </div>
                            {/* <div className="pages">
                                {processRef.pages.map(page =>(
                                    <div className="memory-cell">
                                        <div className="ref-id">{page.address}</div>
                                    </div>
                                ))}
                            </div> */}
                        </div>
                )
            })}
            </div>
        </div>
    )
}

export default PageReference