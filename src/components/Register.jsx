import React, { useState } from "react";
import "./Register.css";
import Logo from '../img/logo.png';
import api from "./api";
import { useNavigate } from "react-router-dom";

const RegisterPage = ({ setAuthMessage }) => {
  const [phoneNumber, setPhoneNumber] = useState("+998");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setAuthMessage({ text: 'Passwords do not match!', status: 'fail' });
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await api.post("/auth/register", {
        phoneNumber, password, firstName, lastName, birthDate, gender, city
      });
      console.log("Registration successful:", response.data);
      setAuthMessage({ text: 'Registration successful! You can Log in.', status: 'success' });
      navigate('/login');
    } catch (error) {
      console.error("Registration failed:", error);
  
      if (error.response?.status === 500) {
        setAuthMessage({ text: 'This Phone number is already registered.', status: 'fail' });
      } else {
        setAuthMessage({
          text: 'Registration failed: ' + (error.response?.data?.message || error.message),
          status: 'fail',
        });
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setAuthMessage(null);
      }, 5000);
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
          required
          maxLength={13}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          className="register-input"
          type="password"
          required
          placeholder="Password"
          minLength="8"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="register-input"
          type="password"
          placeholder="Confirm Password"
          minLength="8"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          className="register-input"
          type="text"
          required
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="register-input"
          type="text"
          required
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          className="register-input"
          type="text"
          required
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="register-input"
          type="date"
          required
          placeholder="Birth Date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
        <select
          id="gender"
          className="gender-input"
          required
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select Gender</option>
          <option value="MALE">MALE</option>
          <option value="FEMALE">FEMALE</option>
        </select>
        <button className="register-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="sign-in-link">
        Already have an account? <a href="/login">Log in</a>
      </p>
    </div>
  );
};

export default RegisterPage;
