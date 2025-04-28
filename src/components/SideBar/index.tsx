import { ChartIcon } from "../UI/ChartIcon"
import "./index.css"

const SideBar = (props : { showModal: () => void, show: boolean }) =>{
    return (
        <nav className="side-bar">
            {/* <ChartIcon onClick={showModal} className={`chart-ico ${show && "chart-ico-active"}`} /> */}
        </nav>
    )
}

export default SideBar