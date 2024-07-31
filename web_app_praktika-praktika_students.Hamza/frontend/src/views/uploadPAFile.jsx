import { useState } from "react";
import useAxios from "../utils/useAxios";

const UploadPAFile = ({ refreshFileList }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [errorSelectedFile, setErrorSelectedFile] = useState("");
  const [errorFileName, setErrorFileName] = useState("");
  const [error, setError] = useState("");
  const api = useAxios();

  const resetState = () => {
    setSelectedFile(null);
    setFileName("");
    document.getElementById("fileInput").value = "";
  };

  const resetErrors = () => {
    setError("");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleFileUpload = (e) => {
    resetErrors();
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("file_name", fileName);

    api
      .post("/api/uploadPAFile/", formData)
      .then(() => {
        resetState();
        refreshFileList();
      })
      .catch((error) => {
        const errorMessages = error.response.data;

        if ("file" in errorMessages) {
          setErrorSelectedFile(errorMessages.file.toString());
        }

        if ("file_name" in errorMessages) {
          setErrorFileName(errorMessages.file_name.toString());
        }

        if ("error" in errorMessages) {
          setError(errorMessages.error.toString());
        }
      });
  };

  return (
    <section>
      <form onSubmit={handleFileUpload}>
        <div>
          <label htmlFor="fileInput">Select file:</label>
          <input
            type="file"
            id="fileInput"
            accept=".csv"
            onChange={handleFileChange}
            required
          />
        </div>
        {errorSelectedFile && <p>{errorSelectedFile}</p>}
        <div>
          <label htmlFor="fileNameInput">File Name:</label>
          <input
            type="text"
            id="fileNameInput"
            value={fileName}
            onChange={handleFileNameChange}
            placeholder="Enter file name"
            required
          />
        </div>
        {errorFileName && <p>{errorFileName}</p>}
        <button className="button" type="submit">
          Upload File
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </section>
  );
};

export default UploadPAFile;
