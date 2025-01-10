import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:4000";
  const { userId } = useParams(); // Get dynamic ID
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get token from query string
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Check session
  useEffect(() => {
    const checkAuthorization = async () => {
      const sessionToken = localStorage.getItem("jwt");
      if (!sessionToken) {
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}/home/`, {
          headers: { Authorization: `Bearer ${sessionToken}` },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/forgotpassword/resetPassword/`,
        {
          userId,
          token,
          password: newPassword,
        }
      );

      if (response.status === 201) {
        setMessage("Password reset successful! Redirecting to login");
        navigate("/login");
      } else {
        setErrorMessage(response.data.message || "Something went wrong");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="reset-password-container">
      <h1 className="reset-password-title">Reset Password</h1>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setMessage("");
            setErrorMessage("");
          }}
          placeholder="New Password"
          className="password-input"
          required
        />
        <br />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setMessage("");
            setErrorMessage("");
          }}
          placeholder="Confirm Password"
          className="password-input"
          required
        />
        <br />
        {message && <p className="message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="submit-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
