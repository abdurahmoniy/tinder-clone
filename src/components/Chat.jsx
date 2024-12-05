import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Chat({ db, setNavDisplay, userData }) {
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState({});
  const [userIsActive, setUserIsActive] = useState(true);

  if (!currentUser) {
    setNavDisplay(true);
  } else {
    setNavDisplay(false);
  }

  const handleSelectUser = (user) => {
    setCurrentUser(user);
    if (!chats[user.id]) {
      setChats((prevChats) => ({ ...prevChats, [user.id]: [] }));
    }
  };

  const handleSendMessage = () => {
    if (input.trim() && currentUser) {
      setChats((prevChats) => ({
        ...prevChats,
        [currentUser.id]: [
          ...(prevChats[currentUser.id] || []),
          { sender: "user", text: input },
        ],
      }));
      setInput("");
      setTimeout(() => {
        handleBotResponse(currentUser.id);
      }, 1000);
    }
  };

  const handleBotResponse = (userId) => {
    setChats((prevChats) => ({
      ...prevChats,
      [userId]: [
        ...(prevChats[userId] || []),
        { sender: "bot", text: "This is a bot response!" },
      ],
    }));
  };

  const filteredDb = db.filter((user) => user.id !== userData.userId);

  return (
    <div className="chat">
      {/* {!currentUser ? (
        <div className="title">Messages</div>
      ) : null} */}
      {!currentUser ? (
        <div className="chat-list">
          <div className="current-user">
            <Link to='/profile'>
              {userData.firstName}
            </Link>
          </div>
          <div className="searchbar">
            <input 
              type="search" 
              placeholder="Search..."
            />
            <i className="fas fa-search"></i>
          </div>
          <hr />
          <div className="title">
            Chats
            <i className="fas fa-ellipsis"></i>
          </div>
          {filteredDb.map((user) => (
            <div
              key={user.id}
              className="user-item"
              onClick={() => handleSelectUser(user)}
            >
              <div className="first">
                <img
                  src="https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
                  alt=""
                  className="user-avatar"
                />
                <div style={{ display: "block" }}>
                  <div className="name">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="last-message">Last message</div>
                </div>
              </div>
              <div className="last">
                <div className="last-chat">15 min</div>
                <div className="new-message">2</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="chat-window">
          <div className="chat-header">
            <div className="currentUser">
              <button onClick={() => setCurrentUser(null)}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <img
                src="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg"
                alt=""
                className="user-avatar"
              />
              <div className="nameTitle">
                {currentUser.firstName}
                {userIsActive && (
                  <div className="isActive">
                    <i className="fas fa-circle-dot activeDot"></i>
                    <div className="activeText">Active now</div>
                  </div>
                )}
              </div>
            </div>
            <i className="fas fa-ellipsis"></i>
          </div>
          <div className="messages">
            {chats[currentUser.id]?.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
