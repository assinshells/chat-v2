// frontend/src/contexts/NotificationContext.jsx - Контекст уведомлений
const NotificationContext = createContext(null);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id = Date.now();
        const newNotification = {
            id,
            type: 'info',
            duration: 3000,
            ...notification,
        };

        setNotifications(prev => [...prev, newNotification]);

        if (newNotification.duration) {
            setTimeout(() => {
                removeNotification(id);
            }, newNotification.duration);
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const value = useMemo(() => ({
        notifications,
        addNotification,
        removeNotification,
        success: (message) => addNotification({ type: 'success', message }),
        error: (message) => addNotification({ type: 'danger', message }),
        info: (message) => addNotification({ type: 'info', message }),
        warning: (message) => addNotification({ type: 'warning', message }),
    }), [notifications, addNotification, removeNotification]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer notifications={notifications} onClose={removeNotification} />
        </NotificationContext.Provider>
    );
};

NotificationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Notification Container Component
const NotificationContainer = ({ notifications, onClose }) => {
    if (notifications.length === 0) return null;

    return (
        <div
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: 9999 }}
        >
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`alert alert-${notification.type} alert-dismissible fade show`}
                    role="alert"
                >
                    {notification.message}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => onClose(notification.id)}
                        aria-label="Close"
                    />
                </div>
            ))}
        </div>
    );
};

NotificationContainer.propTypes = {
    notifications: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
};