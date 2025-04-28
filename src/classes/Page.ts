export class Page {
    address: number
    visits: number
    recentlyUsed: boolean
    lastUsedIndex: number = -1

    constructor(address: number, visits=0, recentlyUsed=false) {
        this.address = address
        this.visits = visits
        this.recentlyUsed = recentlyUsed
    }
}