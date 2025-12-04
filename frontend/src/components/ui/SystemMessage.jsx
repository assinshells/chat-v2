// frontend/src/components/ui/SystemMessage.jsx
import { memo, useCallback, useMemo } from 'react';
import { getColorHex } from '../../utils/colors';

const SystemMessage = memo(function SystemMessage({ data, onUserClick }) {
    const userColor = useMemo(() =>
        getColorHex(data.messageColor || 'black'),
        [data.messageColor]
    );

    const handleClick = useCallback(() => {
        if (onUserClick) {
            onUserClick({
                userId: data.userId,
                nickname: data.nickname
            });
        }
    }, [data.userId, data.nickname, onUserClick]);

    return (
        <div className="text-center my-3">
            <small className="text-muted">
                <span
                    onClick={handleClick}
                    style={{
                        color: userColor,
                        fontWeight: '600',
                        cursor: onUserClick ? 'pointer' : 'default',
                        textDecoration: 'none'
                    }}
                    onMouseEnter={(e) => {
                        if (onUserClick) {
                            e.target.style.textDecoration = 'underline';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (onUserClick) {
                            e.target.style.textDecoration = 'none';
                        }
                    }}
                    title={onUserClick ? 'Кликните, чтобы ответить' : ''}
                >
                    {data.nickname}
                </span>
                {' '}
                <span className="text-muted">
                    {data.message}
                </span>
            </small>
        </div>
    );
});

export default SystemMessage;