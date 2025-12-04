// frontend/src/components/ui/Alert/Alert.jsx
export const Alert = memo(function Alert({
    type = 'info',
    children,
    onClose,
    className = ''
}) {
    return (
        <div className={`alert alert-${type} ${onClose ? 'alert-dismissible' : ''} ${className}`} role="alert">
            {children}
            {onClose && (
                <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                />
            )}
        </div>
    );
});

Alert.propTypes = {
    type: PropTypes.oneOf(['success', 'danger', 'warning', 'info']),
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func,
    className: PropTypes.string,
};