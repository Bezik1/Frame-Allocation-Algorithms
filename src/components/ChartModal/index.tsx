import { useState } from "react";
import { CloseIcon } from "../UI/CloseIcon"
import { CartesianGrid, Area, AreaChart, XAxis, YAxis, Tooltip } from "recharts"
import "./index.css"
import { useSimulation } from "../../contexts/SimulationContext";

const ChartModal = ({ data, close } : { data: any[], close: () => void }) =>{
    const { history } = useSimulation()
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true)
        setTimeout(() => {
            close()
        }, 400)
    }
    
    return (
        <div className={`chart-modal-backgroud ${isExiting ? 'fade-out' : 'fade-in'}`}>
            <div className={`chart-modal ${isExiting ? 'fade-out' : 'fade-in'}`}>
                <nav className="navbar">
                    <CloseIcon  onClick={handleClose} className="close-ico" />
                </nav>
                <div className="charts">
                    <AreaChart
                    width={600}
                    height={400}
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                    <linearGradient id="exploringGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="violet" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="violet" stopOpacity={0} />
                    </linearGradient>
                    </defs>
                    <YAxis />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="exploringPheromon"
                        stroke="violet"
                        fill="violet"
                    />
                </AreaChart>
                <AreaChart
                    width={600}
                    height={400}
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                    <linearGradient id="returningPheromon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="cyan" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="cyan" stopOpacity={0} />
                    </linearGradient>
                    </defs>
                    <YAxis />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="returningPheromon"
                        stroke="cyan"
                        fill="cyan"
                    />
                </AreaChart>
                </div>
            </div>
        </div>
    )
}

export default ChartModal