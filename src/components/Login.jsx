import React, { useState } from "react";
import "./Login.css";
import Logo from '../img/logo.png'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setUserData }) => {
  const [phoneNumber, setPhoneNumber] = useState("+998");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://5410-31-135-213-5.ngrok-free.app/api/auth/login", {
        phoneNumber, 
        password,
        },{
          withCredentials: true,
        });
      const userData = response.data;
      localStorage.setItem("authToken", userData.token);
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log("Logging in with", phoneNumber, password, response.data);
      alert("Login successful");
      setUserData(userData);
      navigate("/");

    } catch (error) {
      console.log("Login failed", error);
      alert("Login failed");
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
