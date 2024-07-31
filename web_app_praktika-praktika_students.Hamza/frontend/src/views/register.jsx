import React, { useEffect, useState } from "react";
import { register } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/"); // navigate to the private home area
    }
  }, [isLoggedIn, navigate]);

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPassword2("");
  };

  const resetError = () => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
  };

  const checkPassword = (password, password2) => password === password2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetError();

    // Validation checks
    if (!username.trim()) {
      setUsernameError("Username is required.");
      return;
    }
    if (!email.trim()) {
      setEmailError("Email is required.");
      return;
    }
    if (!password || !password2) {
      setPasswordError("Both password fields are required.");
      return;
    }
    if (!checkPassword(password, password2)) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const { data, error } = await register(
        username,
        email,
        password,
        password2
      );
      if (error) {
        // Set specific error messages based on backend response
        if (error.username) {
          setUsernameError(error.username.toString());
        }
        if (error.email) {
          setEmailError(error.email.toString());
        }
        if (error.password) {
          setPasswordError(error.password.join("\n"));
        }
      } else {
        resetForm();
        navigate("/"); // navigate to the private home area
      }
    } catch (err) {
      console.error("Registration error:", err);
      setPasswordError("An error occurred. Please try again.");
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>
        <hr />
        <div>
          <label htmlFor="username">
            <b>Username</b>
          </label>
          <input
            type="text"
            id="username"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && <p className="error-message">{usernameError}</p>}
        </div>
        <div>
          <label htmlFor="email">
            <b>E-Mail</b>
          </label>
          <input
            type="email"
            id="email"
            placeholder="E-Mail Address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>
        <div>
          <label htmlFor="password">
            <b>Password</b>
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirm-password">
            <b>Confirm Password</b>
          </label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm Password"
            required
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </section>
  );
}

export default Register;
