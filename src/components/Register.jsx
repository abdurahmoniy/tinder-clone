import React, { useState } from "react";
import "./Register.css";
import Logo from '../img/logo.png'
import axios from "axios";
import api from "./api";

const RegisterPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("+998");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", {
        phoneNumber, password, firstName, lastName, birthDate, gender, city
      });
      console.log("Registration successful:", response.data);
      alert("Registration successful!")
    } catch (error) {
      console.log("Registration failed:", error);
      alert("Registration failed!");
    }
    if (password !== confirmPassword) {
       alert("Passwords do not match!")
    } 
  };

  return (
    <div className="register-container">
      <div className="register-logo">
        <img src={Logo} alt="Tinder" />
      </div>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          className="register-input"
          type="tel"
          placeholder="Phone number"
          value={phoneNumber}
          // maxLength={10}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          className="register-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
          <input
            className="register-input"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        <input
          className="register-input"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="register-input"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="register-input"
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="register-input"
          type="date"
          placeholder="Bith date"
          value={birthDate}
          onChange={(e)=> setBirthDate(e.target.value)}
        />
        <select
          className="register-input"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>
        <button className="register-button" type="submit">Register</button>
      </form>
      <p className="sign-in-link">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
};

export default RegisterPage;
