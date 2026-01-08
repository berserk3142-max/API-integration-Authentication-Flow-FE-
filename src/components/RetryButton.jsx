import './RetryButton.css'

const RetryButton = ({ onClick, label = 'Try Again', disabled = false }) => {
    return (
        <button
            className="retry-button"
            onClick={onClick}
            disabled={disabled}
            type="button"
        >
            {label}
        </button>
    )
}

export default RetryButton
