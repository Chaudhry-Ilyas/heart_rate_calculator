import { useState } from "react";
import useAxios from "../utils/useAxios";
import { logout } from "../utils/auth";

const DeleteUserComponent = () => {
  const [deleteError, setDeleteError] = useState(null);
  const api = useAxios();

  const handleDelete = async () => {
    const confirm = window.confirm("Do you really want to delete this User?");

    if (confirm) {
      try {
        const response = await api.delete("/api/deleteUser/");
        console.log("Delete response:", response);

        alert("Your account has been deleted successfully.");
        logout();
      } catch (error) {
        console.error("Delete error:", error.response || error);
        setDeleteError(
          error.response?.data?.error ||
            "An error occurred while deleting the account."
        );
      }
    }
  };

  return (
    <div>
      <button className="button delete-button" onClick={handleDelete}>
        Delete Account
      </button>
      {deleteError && <p className="error-message">{deleteError}</p>}
    </div>
  );
};

export default DeleteUserComponent;
