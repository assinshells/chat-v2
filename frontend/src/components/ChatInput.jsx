function ChatInput({
    inputMessage,
    setInputMessage,
    selectedUser,
    setSelectedUser,
    connected,
    currentRoom,
    onSendMessage,
    onInputChange
}) {
    return (
        <div className="chat-input-section p-3 p-lg-4 border-top mb-0">
            <div className="row g-0">
                {selectedUser && (
                    <div className="alert alert-info py-2 px-3 mb-2 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-reply-fill me-2"></i>
                            Ответ для: <strong>@{selectedUser.nickname}</strong>
                        </span>
                        <button
                            className="btn btn-sm btn-close"
                            onClick={() => setSelectedUser(null)}
                            aria-label="Отменить"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Отменить ответ"
                        ></button>
                    </div>
                )}
                <form onSubmit={onSendMessage}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={
                                selectedUser
                                    ? `Сообщение для @${selectedUser.nickname}...`
                                    : `Сообщение в # ${currentRoom}`
                            }
                            value={inputMessage}
                            onChange={onInputChange}
                            disabled={!connected}
                            autoComplete="off"
                        />
                        <button
                            className="btn btn-primary px-4"
                            type="submit"
                            disabled={!connected || !inputMessage.trim()}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title={selectedUser ? 'Отправить личное сообщение' : 'Отправить в чат'}
                        >
                            {selectedUser ? (
                                <>
                                    <i className="bi bi-send-fill"></i>
                                    <span className="d-none d-md-inline ms-1">Отправить</span>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-send"></i>
                                    <span className="d-none d-md-inline ms-1">Отправить</span>
                                </>
                            )}
                        </button>
                    </div>
                    {!connected && (
                        <small className="text-danger mt-1 d-block">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            Нет соединения с сервером
                        </small>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ChatInput;