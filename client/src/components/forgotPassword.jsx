import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const baseUrl = import.meta.env.REACT_APP_BASE_URL || "http://localhost:4000";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Check session
  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) {
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/home/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.authorized) {
          navigate("/home");
        }
      } catch (error) {
        console.error("Authorization check failed");
      }
    };

    checkAuthorization();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${baseUrl}/forgotPassword/recoverAccount`,
        {
          email,
        }
      );

      if (response.status === 200) {
        setMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={handleSubmit} className="forgot-password-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="email-input"
          required
        />
        <button type="submit" className="submit-button">
          Recover Account
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default ForgotPassword;
