import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Spinner } from './components/ui';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/css/global.css';

// Lazy load pages
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));
const Chat = lazy(() => import('./pages/Chat/Chat'));

// Protected route component
function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) return <Spinner centered />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
}

// Public route component
function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) return <Spinner centered />;
    if (isAuthenticated) return <Navigate to="/chat" replace />;

    return children;
}

// App routes component
function AppRoutes() {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) return <Spinner centered />;

    return (
        <Routes>
            {/* Public routes */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />
            <Route
                path="/forgot-password"
                element={
                    <PublicRoute>
                        <ForgotPassword />
                    </PublicRoute>
                }
            />
            <Route
                path="/reset-password/:token"
                element={
                    <PublicRoute>
                        <ResetPassword />
                    </PublicRoute>
                }
            />

            {/* Protected routes */}
            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <Chat />
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
    );
}

// Main App component
function App() {
    return (
        <Router>
            <ThemeProvider>
                <AuthProvider>
                    <NotificationProvider>
                        <Suspense fallback={<Spinner centered text="Загрузка приложения..." />}>
                            <AppRoutes />
                        </Suspense>
                    </NotificationProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;