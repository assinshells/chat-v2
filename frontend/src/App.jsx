// frontend/src/App.jsx
import { lazy, Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import storageService from './services/storage.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/css/global.css';

// Lazy load pages for code splitting
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const Chat = lazy(() => import('./pages/Chat/Chat'));

// Loading fallback component
const LoadingFallback = () => (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
        </div>
    </div>
);

// Protected route wrapper
function ProtectedRoute({ children, isAuthenticated }) {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

// Public route wrapper (redirects to chat if authenticated)
function PublicRoute({ children, isAuthenticated }) {
    if (isAuthenticated) {
        return <Navigate to="/chat" replace />;
    }
    return children;
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = storageService.getToken();
        const user = storageService.getUser();

        if (token && user) {
            setIsAuthenticated(true);
        }

        setLoading(false);
    }, []);

    if (loading) {
        return <LoadingFallback />;
    }

    return (
        <ThemeProvider>
            <Router>
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        {/* Public routes */}
                        <Route
                            path="/login"
                            element={
                                <PublicRoute isAuthenticated={isAuthenticated}>
                                    <Login setAuth={setIsAuthenticated} />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/register"
                            element={
                                <PublicRoute isAuthenticated={isAuthenticated}>
                                    <Register setAuth={setIsAuthenticated} />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/forgot-password"
                            element={
                                <PublicRoute isAuthenticated={isAuthenticated}>
                                    <ForgotPassword />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/reset-password/:token"
                            element={
                                <PublicRoute isAuthenticated={isAuthenticated}>
                                    <ResetPassword />
                                </PublicRoute>
                            }
                        />

                        {/* Protected routes */}
                        <Route
                            path="/chat"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Chat setAuth={setIsAuthenticated} />
                                </ProtectedRoute>
                            }
                        />

                        {/* Default redirect */}
                        <Route
                            path="/"
                            element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />}
                        />

                        {/* 404 fallback */}
                        <Route
                            path="*"
                            element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />}
                        />
                    </Routes>
                </Suspense>
            </Router>
        </ThemeProvider>
    );
}

export default App;