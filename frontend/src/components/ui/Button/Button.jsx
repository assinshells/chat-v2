// frontend/src/components/ui/Button/Button.jsx
import { memo } from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export const Button = memo(function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    disabled = false,
    loading = false,
    type = 'button',
    onClick,
    className = '',
    ...props
}) {
    const buttonClasses = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'w-100',
        disabled && 'disabled',
        loading && 'loading',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && (
                <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </span>
            )}
            {children}
        </button>
    );
});

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'outline-primary']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    className: PropTypes.string,
};