import { useState } from "react";
import useAxios from "../utils/useAxios";
import { checkPassword } from "../utils/password";

const ChangePasswordComponent = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [changeSuccess, setChangeSuccess] = useState("");
  const api = useAxios();

  const resetError = () => setError("");
  const resetPasswords = () => {
    setOldPassword("");
    setNewPassword("");
    setNewPasswordConfirm("");
  };
  const resetChangeSuccess = () => setChangeSuccess("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const confirmChange = window.confirm(
      "Are you sure you want to change your password?"
    );

    if (confirmChange) {
      if (checkPassword(newPassword, newPasswordConfirm)) {
        try {
          await api.put("http://127.0.0.1:8000/api/changePassword/", {
            old_password: oldPassword,
            new_password: newPassword,
            new_password_confirm: newPasswordConfirm,
          });
          setChangeSuccess("Password changed successfully!");
          resetError();
          resetPasswords();
        } catch (error) {
          setError(error.response.data.error || "An error occurred.");
          resetChangeSuccess();
        }
      } else {
        setError("Passwords do not match.");
      }
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <div>
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            required
          />
        </div>
        <p className="error-message">{error}</p>
        <p className="success-message">{changeSuccess}</p>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePasswordComponent;
