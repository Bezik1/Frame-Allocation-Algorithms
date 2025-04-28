import { createContext, ReactNode, useContext, useState } from "react";
import { BASE_BATCH_SIZE, BASE_PAGE_FRAME_COUNT, BASE_PAGE_MAX_COUNT, BASE_PAGE_REFERENCE_LENGTH } from "../const/pageSettings";
import { PagesContextType } from "../types/contextTypes";

const PageSettingsContext = createContext<PagesContextType>({
    batchSize: BASE_BATCH_SIZE,
    setBatchSize: undefined,
    pageFrameCount: BASE_PAGE_FRAME_COUNT,
    pageMaxCount: BASE_PAGE_MAX_COUNT,
    pageReferenceLength: BASE_PAGE_REFERENCE_LENGTH,
    setPageFrameCount: undefined,
    setPageMaxCount: undefined,
    setPageReferenceLength: undefined
})

export const PageSettingsProvider = ({ children } : { children?: ReactNode | ReactNode[] }) =>{
    const [batchSize, setBatchSize] = useState(BASE_BATCH_SIZE)
    const [pageFrameCount, setPageFrameCount] = useState(BASE_PAGE_FRAME_COUNT)
    const [pageMaxCount, setPageMaxCount] = useState(BASE_PAGE_MAX_COUNT)
    const [pageReferenceLength, setPageReferenceLength] = useState(BASE_PAGE_REFERENCE_LENGTH)
    
    return (
        <PageSettingsContext.Provider value={{
            batchSize,
            pageFrameCount,
            pageMaxCount,
            pageReferenceLength,
            setBatchSize,
            setPageFrameCount,
            setPageMaxCount,
            setPageReferenceLength,
        }}>
            {children}
        </PageSettingsContext.Provider>
    )
}

export const usePageSettings = () =>{
    const {
        batchSize,
        pageFrameCount,
        pageMaxCount,
        pageReferenceLength,
        setBatchSize,
        setPageFrameCount,
        setPageMaxCount,
        setPageReferenceLength,
    } = useContext(PageSettingsContext)

    if( typeof setPageFrameCount === "undefined" ||
        typeof setPageMaxCount === "undefined" ||
        typeof setPageReferenceLength === "undefined" ||
        typeof setBatchSize === "undefined"
    ) throw new Error("Element is outside of Page Settings Context!")

    return {
        batchSize,
        pageFrameCount,
        pageMaxCount,
        pageReferenceLength,
        setBatchSize,
        setPageFrameCount,
        setPageMaxCount,
        setPageReferenceLength,
    }
}