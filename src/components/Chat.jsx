import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import Loader from "./Loader"; // Assuming Loader component exists

export default function Chat({ setNavDisplay, userData }) {
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState({});
  const [userIsActive, setUserIsActive] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/chats/my");
        if (response.status === 200 && Array.isArray(response.data.data)) {
          setData(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false); // Set loading to false when the data is fetched
      }
    };
    fetchUsers();
  }, []);

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

  return (
    <div className="chat">
      {!currentUser ? (
        <div className="chat-list">
          <div className="current-user">
            <Link to="/profile">{userData?.firstName}</Link>
          </div>
          <div className="searchbar">
            <input type="search" placeholder="Search..." />
            <i className="fas fa-search"></i>
          </div>
          <hr />
          <div className="title">
            Chats
            <i className="fas fa-ellipsis"></i>
          </div>
          {loading ? (
            <Loader />
          ) : data.length === 0 ? (
            <div className="users-finished">
              <div className="snowflakes" aria-hidden="true">
                {[...Array(10)].map((_, idx) => (
                  <img
                    key={idx}
                    src="logo.png"
                    alt="logo"
                    className="snowflake"
                  />
                ))}
              </div>
              <p className="users-finished-message">You have no likes</p>
            </div>
          ) : (
            <div className="chats-list">
              {data.map((user) => (
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
                      <div className="name">{user.userFullName}</div>
                      <div className="last-message">{user.lastMessage}</div>
                    </div>
                  </div>
                  <div className="last">
                    <div className="last-chat">15 min</div>
                    {user.newMessagesCount === 0 ? (
                      ""
                    ) : (
                      <div className="new-message">{user.newMessagesCount}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
                {currentUser.userFullName}
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
                className={`message ${msg.sender === "user" ? "user" : "bot"}`}
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
