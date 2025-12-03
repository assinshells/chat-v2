import { getColorHex } from '../utils/colors';

function SystemMessage({ data, onUserClick }) {
    const userColor = getColorHex(data.messageColor || 'black');

    return (
        <div className="text-center my-3">
            <small className="text-muted">
                <span
                    onClick={() => onUserClick && onUserClick({
                        userId: data.userId,
                        nickname: data.nickname
                    })}
                    style={{
                        color: userColor,
                        fontWeight: '600',
                        cursor: onUserClick ? 'pointer' : 'default',
                        textDecoration: onUserClick ? 'none' : 'none'
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
}

export default SystemMessage;