function ChatInput({
    inputMessage,
    setInputMessage,
    selectedUser,
    setSelectedUser,
    connected,
    currentRoom,
    onSendMessage,
    onInputChange,
    onOpenPrivateMessage
}) {
    return (
        <div className="chat-input-section p-3 p-lg-4 border-top mb-0">
            <div className="row g-0">
                {selectedUser && (
                    <div className="alert alert-primary py-2 px-3 mb-2 d-flex justify-content-between align-items-center">
                        <span>
                            <i className="bi bi-at me-2"></i>
                            Ответить в чат: <strong>@{selectedUser.nickname}</strong>
                        </span>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-sm btn-success"
                                onClick={() => onOpenPrivateMessage(selectedUser)}
                                title="Отправить личное сообщение"
                            >
                                <i className="bi bi-envelope-fill"></i>
                                <span className="d-none d-md-inline ms-1">Личное</span>
                            </button>
                            <button
                                className="btn btn-sm btn-close"
                                onClick={() => setSelectedUser(null)}
                                aria-label="Отменить"
                                title="Отменить"
                            ></button>
                        </div>
                    </div>
                )}
                <form onSubmit={onSendMessage}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={
                                selectedUser
                                    ? `Ответить @${selectedUser.nickname} в # ${currentRoom}`
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
                            title="Отправить в чат"
                        >
                            <i className="bi bi-send"></i>
                            <span className="d-none d-md-inline ms-1">Отправить</span>
                        </button>
                    </div>
                    {!connected && (
                        <small className="text-danger mt-1 d-block">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            Нет соединения с сервером
                        </small>
                    )}
                    {selectedUser && (
                        <small className="text-muted mt-1 d-block">
                            <i className="bi bi-info-circle me-1"></i>
                            Сообщение будет видно всем в комнате "#{currentRoom}"
                        </small>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ChatInput;