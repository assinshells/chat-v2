// frontend/src/components/ui/Select/Select.jsx
export const Select = memo(function Select({
    label,
    name,
    value,
    onChange,
    options,
    error,
    touched,
    disabled = false,
    required = false,
    placeholder,
    className = '',
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
            <select
                id={name}
                name={name}
                className={`form-select ${hasError ? 'is-invalid' : ''}`}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {hasError && (
                <div className="invalid-feedback d-block">{error}</div>
            )}
        </div>
    );
});

Select.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    error: PropTypes.string,
    touched: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
};