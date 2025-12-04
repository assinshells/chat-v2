// frontend/src/components/ui/Spinner/Spinner.jsx
export const Spinner = memo(function Spinner({
    size = 'md',
    centered = false,
    text = 'Загрузка...'
}) {
    const spinnerClasses = `spinner-border text-primary ${size === 'sm' ? 'spinner-border-sm' : ''}`;

    const spinner = (
        <>
            <div className={spinnerClasses} role="status">
                <span className="visually-hidden">{text}</span>
            </div>
            {text && <div className="mt-2">{text}</div>}
        </>
    );

    if (centered) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                {spinner}
            </div>
        );
    }

    return spinner;
});

Spinner.propTypes = {
    size: PropTypes.oneOf(['sm', 'md']),
    centered: PropTypes.bool,
    text: PropTypes.string,
};