import React, { useState } from "react";
import "./Login.css";
import Logo from '../img/logo.png'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "./api";

const Login = ({ setUserData, setAuthMessage }) => {
  const [phoneNumber, setPhoneNumber] = useState("+998");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await api.post('/auth/login', {
        phoneNumber,
        password,
      });
  
      const userData = response.data;
  
      localStorage.setItem("authToken", userData.token);
      localStorage.setItem("userData", JSON.stringify(userData));
  
      console.log("Logging in with", phoneNumber, password, response.data);
      setAuthMessage({ text: 'Login successful! Welcome back.', status: 'success' });

      setUserData(userData);
      navigate("/");

      setTimeout(() => {
        setAuthMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Login failed", error.response?.data || error.message);
      setAuthMessage({ text: 'Login failed: ' + (error.response?.data?.message || error.message), status: 'fail' });

      setTimeout(() => {
        setAuthMessage(null);
      }, 5000);
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
