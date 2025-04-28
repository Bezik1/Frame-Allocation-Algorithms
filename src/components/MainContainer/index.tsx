import "./index.css"
import MemoryContainer from "../MemoryContainer"
import PageReference from "../PageReference"
import { MainContainerProps } from "../../types/Props"

const MainContainer = ({ memory, reference } : MainContainerProps) =>{

    return (
        <div className="main-container container">
            <div className="playground">
                <h1>Playground</h1>
                <MemoryContainer memory={memory} reference={reference}/>
                <PageReference reference={reference}/>
            </div>
        </div>
    )
}

export default MainContainer