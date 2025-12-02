function ChatHeader({ currentRoom, connected, onlineCount, user, onLogout }) {
    return (
        <div className="user-chat w-100 overflow-hidden">
            <div className="d-lg-flex">
                <div className="w-100 overflow-hidden position-relative">
                    <div className="p-3 p-lg-4 border-bottom user-chat-topbar">
                        <div className="row align-items-center">
                            <div className="col-sm-4 col-8">
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1 overflow-hidden">
                                        <h5 className="font-size-16 mb-0 text-truncate"><a href="#" className="text-reset user-profile-show">
                                            <i className="bi bi-person-circle me-1"></i>
                                            {user.nickname}
                                        </a><i
                                            className="bi bi-circle-fill ms-3"
                                            title={connected ? "Онлайн" : "Офлайн"}
                                            style={{
                                                fontSize: "0.55rem",
                                                color: connected ? "var(--bs-success)" : "var(--bs-danger)",
                                                cursor: "pointer"
                                            }}
                                        ></i></h5>

                                        <h5 className="mb-0">
                                            <i className="bi bi-hash"></i> {currentRoom}
                                        </h5>
                                        <small>
                                            <i className="bi bi-people-fill me-1"></i>
                                            {onlineCount} онлайн
                                        </small>
                                    </div>
                                </div>
                            </div>


                            <div className="col-sm-8 col-4">


                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ChatHeader;