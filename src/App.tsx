import { useEffect, useRef, useState } from 'react'
import './App.css'
import MainContainer from './components/MainContainer'
import SettingsContainer from './components/SettingsContainer'
import { usePageSettings } from './contexts/PageSettingsContext'
import { useSimulation } from './contexts/SimulationContext'
import { Page } from './classes/Page'
import { generateBatches } from './utils/generateBatches'
import InfoContainer from './components/InfoContainer'
import ChartContainer from './components/ChartContainer'
import ChartModal from './components/ChartModal'
import { EPSILON } from './const/pageSettings'
import SideBar from './components/SideBar'
import { Process } from './classes/Process'
import { HistoryElement } from './types/HistoryElement'

const App = () => {
  const { batchSize, pageFrameCount, pageMaxCount, pageReferenceLength } = usePageSettings()
  const { setAllocations, maxFrameCount, speed, history, batches, setHistory, setBatches, batchIndex, frameAllocationAlgorithm, localityWindowSize, minLocalPages, maxLocalPages } = useSimulation()

  const [currentProcessReference, setCurrentProcessReference] = useState<Process[]>([])
  const [currentMemory, setCurrentMemory] = useState<(Page | undefined)[]>([])

  const [pageFaultsCounts, setPageFaultsCounts] = useState<number[]>([])
  const [pageFaultsCount, setPageFaultsCount] = useState(0)
  const indexRef = useRef(0)
  const indexesRef = useRef<number[]>([])

  const [simulation, setSimulation] = useState(false)
  const [show, setShow] = useState(false)

  const allocationsRef = useRef<number[]>([])
  const currentProcessReferenceRef = useRef<Process[]>([])
  const currentMemoryRef = useRef<(Page | undefined)[]>([])
  const recentReferencesRef = useRef<number[]>([]);
  const workingSetsRef = useRef<number[][]>([])


  const intervalRef = useRef<number>(0)

  useEffect(() => {
    setBatches(generateBatches(batchSize, pageFrameCount, pageMaxCount, pageReferenceLength, localityWindowSize, minLocalPages, maxLocalPages, maxFrameCount))
  }, [batchSize, pageFrameCount, pageMaxCount, pageReferenceLength, localityWindowSize, minLocalPages, maxLocalPages, maxFrameCount])

  useEffect(() => {
    if (batches.length === 0) return;
    const { processReference, memory } = batches[batchIndex]
    indexesRef.current = new Array<number>(processReference.length)

    recentReferencesRef.current  = new Array(processReference.length).fill(0)
    workingSetsRef.current = new Array(processReference.length).fill([])

    setPageFaultsCounts(new Array(processReference.length).fill(0))
    setCurrentProcessReference(processReference)
    setCurrentMemory(memory)
    currentProcessReferenceRef.current = processReference
    currentMemoryRef.current = memory
    setPageFaultsCount(0)
    resetCurrentBatch()
  }, [batches, batchIndex])

  const simulate = () => {    
    const processRef = currentProcessReferenceRef.current
    const memory = currentMemoryRef.current

    if (processRef.filter(process => process.pages.length > 0).length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    const [updatedMemory, allocations, pageFaults] = frameAllocationAlgorithm(
      processRef,
      memory,
      indexesRef.current,
      recentReferencesRef.current,
      allocationsRef.current,
      workingSetsRef.current,
    );

    pageFaults.forEach((fault, idx) => setPageFaultsCounts(prev => [
      ...prev.slice(0, idx),
      prev[idx] + fault,
      ...prev.slice(idx+1)
    ]))

    setPageFaultsCount(prev => prev + pageFaults.reduce((state, next) => state + next))

    indexesRef.current = indexesRef.current.map(el => el+1)
    allocationsRef.current = allocations
    currentMemoryRef.current = updatedMemory
    recentReferencesRef.current = pageFaults.map((count, idx) => count + recentReferencesRef.current[idx]);

    setAllocations(allocations)
    setCurrentMemory([...updatedMemory])
    indexRef.current += 1
  }

  const loop = () => {
    setSimulation(prev => {
      const shouldRun = !prev;
      
      if (intervalRef.current) clearInterval(intervalRef.current);
  
      if (shouldRun) {
        intervalRef.current = setInterval(simulate, (1 / (speed + EPSILON)) * 1000);
      }
  
      return shouldRun;
    });
  }

  const resetCurrentBatch = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSimulation(false);
  
    const processes: {
      id: number,
      pageFaults: number
      weight: number
    }[] = []

    currentProcessReference.forEach((process, i) => processes.push({
      id: process.id,
      pageFaults: pageFaultsCounts[i],
      weight: process.weight,
    }))

    const historyElement: HistoryElement = {
      name: frameAllocationAlgorithm.name,
      pageFaultCount: pageFaultsCount,
      processes,
    } 

    if(pageFaultsCount != 0)setHistory(prev => [...prev, historyElement])

    const { processReference, memory } = batches[batchIndex];
  
    indexRef.current = 0;
    indexesRef.current = new Array<number>(processReference.length).fill(0);
    setPageFaultsCount(0);

    workingSetsRef.current = new Array(processReference.length).fill([])

    setPageFaultsCounts(new Array(processReference.length).fill(0));
    recentReferencesRef.current = new Array(processReference.length).fill(0)
  
    const deepCopiedProcessReference = processReference.map(p => new Process(p.id, p.weight, p.pages.map(pg => new Page(pg.address, 0, false))));
  
    setCurrentProcessReference(deepCopiedProcessReference);
    currentProcessReferenceRef.current = deepCopiedProcessReference;
  
    setCurrentMemory(memory);
    currentMemoryRef.current = memory;

    setAllocations([])
    allocationsRef.current = []
  }
  
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className='app'>
      <title>Frame Allocation Algorithms</title>
      {show && <ChartModal data={[]} close={() => setShow(false)}/>}
      <SideBar
        showModal={() => setShow(true)}
        show={show}
      />
      <div className='row'>
        <MainContainer memory={currentMemory} reference={currentProcessReference} />
        <SettingsContainer
          simulate={loop}
          simulation={simulation}
          reset={resetCurrentBatch}
        />
      </div>
      <div className='row'>
        <InfoContainer
          reference={currentProcessReference}
          index={indexRef.current}
          pageFaultsCounts={pageFaultsCounts}
          pageFaultsCount={pageFaultsCount}
          history={history}
        />
        <ChartContainer />
      </div>
    </div>
  )
}

export default App
