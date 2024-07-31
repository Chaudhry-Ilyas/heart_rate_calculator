import { useState } from "react";
import axios from "../utils/axios";
import { useParams } from "react-router-dom";
import { checkPassword } from "../utils/password";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);

  const resetState = () => {
    setEmailError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetState();
    try {
      // TODO: Set here the adress to the password reset url and send the E-Mail Adress in the data from the post request
      const response = await axios.post(
        "http://127.0.0.1:8000/api/password_reset/",
        { email }
      );
      alert(response.data.message);
    } catch (error) {
      if (error.response.data.email) {
        setEmailError(error.response.data.email);
      } else {
        alert(error.response.data);
      }
    }
  };

  return (
    <section>
      <h1>Forget your password?</h1>
      <p>
        Enter your email address below, and we will send you an email with
        instructions for setting a new one.
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            <b>E-Mail</b>
          </label>
          {/* TODO: set the value from this input to the email constants with the onChange function */}
          <input
            type="text"
            id="email"
            value={email}
            placeholder="E-Mail Address"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {/* TODO: Show the E-Mail error. Set the style from the error to 'error-message' */}
        {emailError && <p className="error-message">{emailError}</p>}
        {/* TODO: set the style from the button to 'button' */}
        <button type="submit" className="button">
          Send E-Mail
        </button>
      </form>
    </section>
  );
};

export const ResetPasswordConfirm = () => {
  // TODO: get the uid, and token from the link
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const resetError = () => {
    setError(null);
  };

  const handleRestPassword = async (e) => {
    e.preventDefault();
    if (checkPassword(newPassword, newPasswordConfirm)) {
      try {
        // TODO: Set here the adress to the password reset, with the new passwords in the data from the put request
        await axios.put(
          `http://127.0.0.1:8000/api/password_reset/${uid}/${token}/`,
          {
            new_password: newPassword,
            new_password_confirm: newPasswordConfirm,
          }
        );
        resetError();
        alert("Password reset was successful.");
        navigate("/login");
        // TODO: navigate to the login page.
      } catch (error) {
        setError(error.response.data["error"]);
      }
    }
  };

  return (
    <div>
      <div>
        <h2>Change Password</h2>
        <form onSubmit={handleRestPassword}>
          <div>
            <label>New Password:</label>
            {/* TODO: set the value from this input to the newPassword constants with the onChange function */}
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <p>The password must have at least 8 characters.</p>
            <p>The password can't be entirely numeric. </p>
            <p>The password can't be a commonly used password.</p>
          </div>
          <div>
            <label>Confirm New Password:</label>
            {/* TODO: set the value from this input to the newPasswordConfirm constants with the onChange function */}
            <input
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
            />
          </div>
          {/* TODO: Show a error message when newPassword and newPasswordConfirm is not the same. Set the style from the error to 'error-message' */}
          <p>
            {!checkPassword(newPassword, newPasswordConfirm)
              ? "Passwords do not match"
              : ""}
          </p>
          {/* TODO: Show the error. Set the style from the error to 'error-message' */}
          {error && <p className="error-message">{error}</p>}
          {/* TODO: set the style from the button to 'button' */}
          <button type="submit" className="button">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};
