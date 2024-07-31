import "../styles/infoUser.css";
import { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";

const InfoUserComponent = () => {
  const [info, setInfo] = useState({});
  const [errorInfo, setErrorInfo] = useState(null);
  const [editInfo, setEditInfo] = useState(false);
  const [newInfo, setNewInfo] = useState({});
  const api = useAxios();

  const fetchData = async () => {
    try {
      const response = await api.get("/api/getUserInfo/"); // Adjust the endpoint as necessary
      setInfo(response.data);
      resetState();
      setErrorInfo(null);
    } catch (error) {
      setErrorInfo(error.response.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditMode = () => {
    setEditInfo(!editInfo);
    resetState();
    setErrorInfo(null);
  };

  const resetState = () => {
    setNewInfo({
      email: info.email,
      first_name: info.first_name,
      last_name: info.last_name,
    });
  };

  const handleSaveInfo = async () => {
    let sendInfo = {};
    if (info.email !== newInfo.email) sendInfo.email = newInfo.email;
    if (info.first_name !== newInfo.first_name)
      sendInfo.first_name = newInfo.first_name;
    if (info.last_name !== newInfo.last_name)
      sendInfo.last_name = newInfo.last_name;

    if (Object.keys(sendInfo).length > 0) {
      try {
        await api.put("/api/setUserInfo/", { sendInfo }); // Adjust the endpoint as necessary
        fetchData();
      } catch (error) {
        setErrorInfo(error.response.data);
      }
    } else {
      setErrorInfo("There are no changes!");
    }
    setEditInfo(false);
  };

  const handleChange = (name, value) => {
    setNewInfo({ ...newInfo, [name]: value });
  };

  const editableRow = (rowName, name, value) => (
    <tr>
      <td className="info-user-name-cell">
        <strong>{rowName}</strong>
      </td>
      <td>
        {editInfo ? (
          <input
            type="text"
            name={name}
            value={newInfo[name]}
            onChange={(e) => handleChange(name, e.target.value)}
            className={info[name] !== newInfo[name] ? "info-user-changed" : ""}
          />
        ) : (
          value
        )}
      </td>
    </tr>
  );

  return (
    <div>
      <p>
        <strong>User Information</strong>
      </p>
      <table className="info-user">
        <tbody>
          <tr>
            <td className="info-user-name-cell">
              <strong>Username</strong>
            </td>
            <td>{info.username}</td>
          </tr>
          {editableRow("E-Mail Address", "email", info.email)}
          {editableRow("First Name", "first_name", info.first_name)}
          {editableRow("Last Name", "last_name", info.last_name)}
          <tr>
            <td className="info-user-name-cell">
              <strong>Is Superuser</strong>
            </td>
            <td>{info.is_superuser ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      </table>
      {editInfo && (
        <button className="button" onClick={handleSaveInfo}>
          Save
        </button>
      )}
      <button className="button" onClick={handleEditMode}>
        {editInfo ? "Cancel" : "Edit Info"}
      </button>
      {errorInfo && <p className="error-message">{errorInfo}</p>}
    </div>
  );
};

export default InfoUserComponent;
