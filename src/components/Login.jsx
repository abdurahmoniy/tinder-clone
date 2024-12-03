import React, { useState } from "react";
import "./Login.css";
import Logo from '../img/logo.png'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "./api";

const Login = ({ setUserData }) => {
  const [phoneNumber, setPhoneNumber] = useState("+998");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Send login request
      const response = await api.post('/auth/login', {
        phoneNumber,
        password,
      });
  
      // Extract user data from response
      const userData = response.data;
  
      // Save token and user data to local storage
      localStorage.setItem("authToken", userData.token);
      localStorage.setItem("userData", JSON.stringify(userData));
  
      console.log("Logging in with", phoneNumber, password, response.data);
      alert("Login successful");
  
      // Update state and navigate
      setUserData(userData);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
      alert("Login failed: " + (error.response?.data?.message || error.message));
    }
  };
  



  return (
    <div className="login-container">
      <div className="logo">
        <img src={Logo} alt="Tinder" />
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="input"
          type="tel"
          placeholder="Phone number"
          value={phoneNumber}
          // maxLength={10}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" type="submit">Log In</button>
      </form>
      {/* <div className="social-login">
        <button className="button">Log in with Facebook</button>
        <button className="button">Log in with Google</button>
      </div> */}
      <p className="sign-up-link">
        Don't have an account? <a href="/register">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
