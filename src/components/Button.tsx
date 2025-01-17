
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }> = ({
    children,
    className,
    ...props
}) => {
    return (
        <button
            {...props}
            className={`font-bold py-2 px-4 rounded-lg ${className && className} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    )
}

export default Button