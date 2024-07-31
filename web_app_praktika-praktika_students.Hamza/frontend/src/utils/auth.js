import { useAuthStore } from "../store/auth";
import axios from "./axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const login = async (username, password) => {
  try {
    const { data, status } = await axios.post("/token/", {
      username,
      password,
    });

    console.log("Login Response:", data, status); // Debugging

    if (status === 200) {
      if (typeof data.access === "string" && typeof data.refresh === "string") {
        setAuthUser(data.access, data.refresh);
      } else {
        throw new Error("Invalid token format");
      }
    }

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("Login error:", error); // Debugging

    const errorStatus = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.detail || "Something went wrong during login!";

    return {
      data: null,
      error:
        errorStatus === 401 ? errorMessage : "An unexpected error occurred!",
    };
  }
};

export const register = async (username, email, password, password2) => {
  try {
    const requestBody = { username, email, password, password2 };
    console.log("Register Request Body:", requestBody); // Log the request body
    const response = await axios.post("/register/", requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Register Response:", response.data);
    await login(username, password);
    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    return {
      data: null,
      error:
        error.response?.data || "Something went wrong during registration!",
    };
  }
};

export const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  useAuthStore.getState().setUser(null);
};

export const setUser = async () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  if (accessToken === "undefined" || refreshToken === "undefined") {
    return;
  }

  if (!accessToken || !refreshToken) {
    return;
  }

  if (isAccessTokenExpired(accessToken)) {
    const response = await getRefreshToken(refreshToken);
    setAuthUser(response.access, response.refresh);
  } else {
    setAuthUser(accessToken, refreshToken);
  }
};

export const setAuthUser = (access_token, refresh_token) => {
  if (typeof access_token !== "string" || typeof refresh_token !== "string") {
    console.error("Invalid tokens provided to setAuthUser");
    return;
  }
  Cookies.set("access_token", access_token, {
    expires: 1,
    // secure: true,
  });

  Cookies.set("refresh_token", refresh_token, {
    expires: 7,
    // secure: true,
  });

  try {
    const user = jwtDecode(access_token);
    useAuthStore.getState().setUser(user);
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () => {
  const refresh_token = Cookies.get("refresh_token");
  const response = await axios.post("/token/refresh/", {
    refresh: refresh_token,
  });
  return response.data;
};

export const isAccessTokenExpired = (accessToken) => {
  try {
    const decodedToken = jwtDecode(accessToken);
    return decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    return true; // Token is invalid or expired
  }
};
