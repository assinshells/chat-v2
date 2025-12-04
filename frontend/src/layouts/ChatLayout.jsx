// frontend/src/layouts/ChatLayout.jsx
import { memo } from 'react';

const ChatLayout = memo(function ChatLayout({ sidebar, rightSidebar, children }) {
    return (
        <div className="layout-wrapper d-lg-flex">
            {sidebar}

            <div className="user-chat w-100 overflow-hidden">
                {children}
            </div>

            {rightSidebar}
        </div>
    );
});

export default ChatLayout;