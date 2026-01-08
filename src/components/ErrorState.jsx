import './ErrorState.css'

const ErrorState = ({ message, title = 'Something went wrong' }) => {
    return (
        <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">{title}</h3>
            <p className="error-message">{message}</p>
        </div>
    )
}

export default ErrorState
