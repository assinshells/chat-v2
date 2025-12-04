// frontend/src/contexts/AuthContext.jsx - Контекст авторизации
import { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import storageService from '../services/storage.service';

const AuthContext = createContext(null);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = storageService.getToken();
        const storedUser = storageService.getUser();

        if (token && storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = useCallback((userData, token) => {
        storageService.setToken(token);
        storageService.setUser(userData);
        setUser(userData);
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        storageService.clearAll();
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const updateUser = useCallback((updates) => {
        const updatedUser = { ...user, ...updates };
        storageService.setUser(updatedUser);
        setUser(updatedUser);
    }, [user]);

    const value = useMemo(() => ({
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
    }), [user, isAuthenticated, loading, login, logout, updateUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};