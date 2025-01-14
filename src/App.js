import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import Advanced from "./components/Main";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";
import axios from "axios";
import Chat from "./components/Chat";
import UserProfile from "./components/UserProfile";
import api from "./components/api";
import Likes from "./components/Likes";
import Mylikes from "./components/Mylikes";

function App() {
  const nav = [
    { title: "Home", icon: "fas fa-home", path: "/" },
    { title: "My likes", icon: "fas fa-heart-circle-check", path: "/mylikes" },
    { title: "Chat", icon: "fas fa-comment", path: "/chat" },
    { title: "Likes", icon: "fas fa-heart", path: "/likes" },
    { title: "Profile", icon: "fas fa-user", path: "/profile" },
  ];

  const [db, setDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [authMessage, setAuthMessage] = useState({ text: "", status: "" });
  const [messageClass, setMessageClass] = useState("");
  const [navDisplay, setNavDisplay] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const getBgColor = () => {
    if (authMessage.status === "success") return "green";
    if (authMessage.status === "fail") return "red";
    return "transparent";
  };

  // Fetch stored user data from localStorage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    setLoading(false);
  }, []);

  // Fetch users for the current page
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(
          `/users/get-all?page=${currentPage}&size=100`
        );
        if (response.status === 200 && response.data.data?.length > 0) {
          setDb((prevDb) => [...prevDb, ...response.data.data]);
        }
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    fetchUsers();
  }, [currentPage]);

  // Handle logout by clearing stored user data
  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    setUserData(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="app">
      <Router>
        {authMessage && (
          <AuthMessage
            message={authMessage.text}
            status={authMessage.status}
            className={messageClass}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={<Advanced db={db} setCurrentPage={setCurrentPage} />}
          />
          <Route
            path="/login"
            element={
              <Login
                setUserData={setUserData}
                setAuthMessage={setAuthMessage}
              />
            }
          />
          <Route
            path="/register"
            element={<Register setAuthMessage={setAuthMessage} />}
          />
          <Route
            path="/chat"
            element={
              <Chat db={db} userData={userData} setNavDisplay={setNavDisplay} />
            }
          />
          <Route path="/mylikes" element={<Mylikes />} />
          <Route path="/likes" element={<Likes />} />
          <Route
            path="/profile"
            element={
              userData ? (
                <UserProfile
                  userData={userData}
                  setUserData={setUserData}
                  handleLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
        {navDisplay && <Nav nav={nav} />}
      </Router>
    </div>
  );
}

const Nav = ({ nav }) => {
  const location = useLocation();

  // Agar pathname /login yoki /register bo'lsa, komponentni ko'rsatmaymiz
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <div className="navigation">
      {nav.map((item, idx) => (
        <Link
          to={item.path}
          key={idx}
          className={`nav_item ${
            location.pathname === item.path ? "active" : ""
          }`}
        >
          <i className={item.icon}></i>
        </Link>
      ))}
    </div>
  );
};

const AuthMessage = ({ message, status, className }) => {
  return <div className={`${className} auth-message ${status}`}>{message}</div>;
};

export default App;
