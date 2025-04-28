export interface HistoryElement {
    name: string
    pageFaultCount: number
    processes: {
        id: number,
        pageFaults: number
        weight: number
    }[]
}