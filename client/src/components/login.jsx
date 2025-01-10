import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const baseUrl = import.meta.env.REACT_APP_BASE_URL || "http://localhost:4000";
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // check session
  useEffect(() => {
    const checkAuthorization = async () => {
      const token = localStorage.getItem("jwt"); // Get JWT token from localStorage
      if (!token) {
        return;
      }
      // else
      try {
        const response = await axios.get(`${baseUrl}/home/`, {
          headers: { Authorization: `Bearer ${token}` }, // Send token in Authorization header
        });
        console.log("Got response home.jsx");

        if (response.data.authorized) {
          console.log("Authorized");
          navigate("/home");
        } else {
          return;
        }
      } catch (error) {
        return; // Redirect to login if request fails
      }
    };

    checkAuthorization();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, formData);

      if (response.status === 200) {
        // Successful login, redirect to home
        localStorage.setItem("jwt", response.data.token); // Store JWT token
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data._id);
        navigate("/home");
      } else {
        // If status is not 200, show error message
        setErrorMessage(response.data.message || "Login failed. Try again.");
      }
    } catch (error) {
      // Handle request errors
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            id="identifier"
            name="identifier"
            placeholder="Username or email"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
        <p>
          <a href="/forgotPassword">Forgot password?</a>
        </p>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
