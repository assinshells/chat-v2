// frontend/src/layouts/AuthLayout.jsx
import { memo } from 'react';

const AuthLayout = memo(function AuthLayout({ children }) {
    return (
        <div className="auth-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default AuthLayout;