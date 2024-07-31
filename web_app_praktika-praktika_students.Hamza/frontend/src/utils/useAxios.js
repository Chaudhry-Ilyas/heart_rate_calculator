import axios from "axios";
import { getRefreshToken, isAccessTokenExpired, setAuthUser } from "./auth";
import { API_BASE_URL } from "./constants";
import Cookies from "js-cookie";

/*
    This axio instance creates a access and refresh token and it is for all the request between frontend
    and backend after a user is logged in.
*/
const useAxios = () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  const axiosInstance = axios.create({
    // TODO: Set here the url to the api app from the backend
    baseURL: "http://127.0.0.1:8000",
    headers: { Authorization: "Bearer " + accessToken },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    if (!isAccessTokenExpired(accessToken)) {
      return req;
    }

    const response = await getRefreshToken(refreshToken);

    setAuthUser(response.access, response.refresh);

    req.headers.Authorization = "Bearer " + response.data.access;
  });

  return axiosInstance;
};

export default useAxios;
