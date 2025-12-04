// frontend/src/contexts/ThemeContext.jsx - Оптимизированный контекст
import { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { STORAGE_KEYS } from '../constants/config';

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    }, []);

    const value = useMemo(() => ({
        theme,
        toggleTheme,
        isDark: theme === 'dark',
    }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.propTypes = {
    children: PropTypes.node.isRequired,
};