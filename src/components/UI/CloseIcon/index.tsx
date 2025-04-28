export const CloseIcon = ({ className, onClick } : { className?: string, onClick?: () => void }) =>(
    <svg className={className} xmlns="http://www.w3.org/2000/svg" onClick={onClick} width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M8 23.6114L24 7.89084M8 7.89084L24 23.6114" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
)