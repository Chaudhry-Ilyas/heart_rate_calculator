import { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import FileList from "./fileList";
import UploadPAFile from "./uploadPAFile";
import { PAFileHeaders } from "../utils/constants";

const Private = () => {
  const [fileList, setFileList] = useState([]);
  const [listError, setListError] = useState("");
  const [deleteFileError, setDeleteFileError] = useState("");
  const [samplesPerFrequency, setSamplesPerFrequency] = useState(0);
  const [calculationError, setCalculationError] = useState("");
  const [heartrate, setHeartrate] = useState("");
  const api = useAxios();

  const fetchData = async () => {
    try {
      const response = await api.get("/api/getPAFiles/");
      setFileList(response.data.files);
    } catch (error) {
      setListError(error.response.data.error.toString());
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetError = () => {
    setDeleteFileError("");
    setCalculationError("");
  };

  const resetHeartrate = () => {
    setHeartrate("");
  };

  const calculateHeartrate = (file) => {
    resetError();
    if (samplesPerFrequency > 0) {
      api
        .post(`/api/calculateHeartrate/`, {
          file_id: file.id,
          sampling_frequency: samplesPerFrequency,
        })
        .then((response) => {
          setCalculationError("");
          setHeartrate(response.data.heartrate);
        })
        .catch((error) => {
          setCalculationError(error.response.data.error.toString());
          resetHeartrate();
        });
    } else {
      setCalculationError(
        "Set value for samples per frequency that is higher than 0!"
      );
      resetHeartrate();
    }
  };

  const handleSetSampleFrequency = (e) => {
    e.preventDefault();
    const strNumber = e.target.value;
    setSamplesPerFrequency(Number(strNumber));
  };

  const deleteFile = (file) => {
    resetHeartrate();
    api
      .post(`/api/deletePAFile/`, { file_id: file.id }) // Correct endpoint and data
      .then(() => {
        setDeleteFileError("");
        fetchData(); // Refresh the file list after deletion
      })
      .catch((error) => {
        setDeleteFileError(error.response.data.error.toString());
      });
  };

  return (
    <section>
      <h1>Private</h1>
      {listError ? (
        <p className="error-message">{listError}</p>
      ) : (
        <div>
          <FileList
            listName="Uploaded Files"
            files={fileList}
            headers={PAFileHeaders}
            onAction={calculateHeartrate}
            onDelete={deleteFile}
          />
          {deleteFileError && (
            <p className="error-message">{deleteFileError}</p>
          )}
          <div>
            <label htmlFor="samplePerFrequency">Samples per frequency</label>
            <input
              type="text"
              id="samplePerFrequency"
              name="samplePerFrequency"
              value={samplesPerFrequency}
              onChange={handleSetSampleFrequency}
            />
            {calculationError && (
              <p className="error-message">{calculationError}</p>
            )}
            {heartrate && <p>{heartrate}</p>}
          </div>
        </div>
      )}
      <UploadPAFile refreshFileList={fetchData} />
    </section>
  );
};

export default Private;
