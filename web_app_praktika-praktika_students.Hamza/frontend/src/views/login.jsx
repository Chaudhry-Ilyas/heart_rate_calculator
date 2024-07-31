import { useEffect, useState } from "react";
import { login } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(null);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/"); // navigate to the private home area from the frontend
    }
  }, [isLoggedIn, navigate]);

  const resetForm = () => {
    setUsername("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // TODO: Give the username and password to login
    const { error } = await login(username, password);
    if (error) {
      setLoginFailed(error);
    } else {
      navigate("/"); // Navigate to the private home area after successful login
      resetForm();
    }
  };
  return (
    <section>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username</label>
          {/* TODO: set the value from this input to the username constants with the onChange finction */}
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          {/* TODO: set the value from this input to the password constants with the onChange finction */}
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          {/* TODO: Show a error message when the login failed. Set the style from the error to 'error-message' */}
          {loginFailed && <p className="error-message">{loginFailed}</p>}
        </div>
        {/* TODO: set the style from the button to 'button' */}
        <button type="submit">Login</button>
        {/* TODO: Set here a link to the password reset component from the frontend */}
        <Link to="/password_reset">
          <p>Reset password</p>
        </Link>
      </form>
    </section>
  );
};

export default Login;
