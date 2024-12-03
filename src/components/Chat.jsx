import React, { useState } from "react";

export default function Chat({ db }) {
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState({});
  const [userIsActive, setUserIsActive] = useState(true);

  // Handle user selection
  const handleSelectUser = (user) => {
    setCurrentUser(user);
    if (!chats[user.id]) {
      setChats((prevChats) => ({ ...prevChats, [user.id]: [] }));
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() && currentUser) {
      setChats((prevChats) => ({
        ...prevChats,
        [currentUser.id]: [
          ...(prevChats[currentUser.id] || []), // Ensure it’s an array
          { sender: "user", text: input },
        ],
      }));
      setInput("");
      setTimeout(() => {
        handelBotResponse(currentUser.id); // Pass the current user's ID
      }, 1000);
    }
  };

  // Simulate bot response
  const handelBotResponse = (userId) => {
    setChats((prevChats) => ({
      ...prevChats,
      [userId]: [
        ...(prevChats[userId] || []), // Ensure it’s an array
        { sender: "bot", text: "This is a bot response!" },
      ],
    }));
  };

  return (
    <div className="chat">
      <div className="title">Messages</div>
      {!currentUser ? (
        <div className="chat-list">
          {db.map((user) => (
            <div
              key={user.id}
              className="user-item"
              onClick={() => handleSelectUser(user)}
            >
              <div className="first" >
                <img src="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg" alt="" className="user-avatar" />
                <div className="" style={{ display: "block" }}>
                  <div className="name">
                    {user.firstName}
                  </div>
                  <div className="last-message">
                    Last message
                  </div>
                </div>
              </div>
              <div className="last">
                <div className="last-chat">
                  15 min
                </div>
                <div className="new-message">
                  2
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <div className="chat-window">
            <div className="chat-header">
              <div className="currentUser">
                <button onClick={() => setCurrentUser(null)}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <img
                  src="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg"
                  alt="" className="user-avatar" />
                <div className="nameTitle">
                  {currentUser.firstName}
                  {
                    userIsActive ? <div className="isActive">
                      <i className="fas fa-circle-dot activeDot"></i>
                      <div className="activeText">
                        Active now
                      </div>
                    </div> : ""
                  }
                </div>
              </div>
              <i className="fas fa-ellipsis"></i>
            </div>
            <div className="messages">
              {chats[currentUser.id]?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`message ${msg.sender === "user" ? "user" : "bot"
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
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}