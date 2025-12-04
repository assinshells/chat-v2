// frontend/src/components/ui/Input/Input.jsx
export const Input = memo(function Input({
    label,
    name,
    type = 'text',
    value,
    onChange,
    onBlur,
    error,
    touched,
    placeholder,
    disabled = false,
    required = false,
    className = '',
    ...props
}) {
    const hasError = touched && error;

    return (
        <div className={`mb-3 ${className}`}>
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                    {required && <span className="text-danger ms-1">*</span>}
                </label>
            )}
            <input
                type={type}
                id={name}
                name={name}
                className={`form-control ${hasError ? 'is-invalid' : ''}`}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                {...props}
            />
            {hasError && (
                <div className="invalid-feedback d-block">{error}</div>
            )}
        </div>
    );
});

Input.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    error: PropTypes.string,
    touched: PropTypes.bool,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
};