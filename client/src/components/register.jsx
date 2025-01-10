import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const baseUrl = import.meta.env.REACT_APP_BASE_URL || "http://localhost:4000";
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
      const response = await axios.post(`${baseUrl}/auth/register`, formData);

      if (response.status === 201) {
        // Successful registration, redirect to login page
        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data._id);
        navigate("/home");
      } else {
        // If status is not 201, show error message
        setErrorMessage(
          response.data.message || "Registration failed. Try again."
        );
      }
    } catch (error) {
      // Handle request errors
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <div>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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

        <p>
          Have an account? <a href="/login">Login</a>
        </p>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
