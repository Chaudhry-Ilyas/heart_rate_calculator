// TODO: Set here the base url to the backend server
export const BASE_URL = "http://127.0.0.1:8000/"; // The base url to the backend
// TODO: Set here the url to the backend app 'api' with the 'BASE_URL' as prefix
export const API_BASE_URL = "http://127.0.0.1:8000/api/";  // The url to to the app from the backend

// TODO: Add file name and upload time from the file to the PAFileHeader
export const PAFileHeaders = {
    'File ID': 'id',
    'File Name': 'file_name',
    'Upload Time': 'upload_at'
}; // To build the table for the Photoacoustic Files from the fileList.jsx
