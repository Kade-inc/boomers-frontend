import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const API_URL = "http://localhost:5001/api";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    id: string;
    role: string;
  };
}

export interface DecodedToken {
  user: {
    email: string;
    id: string;
    role: string;
  };
  aud: string;
  exp: number;
}

export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/users/login`, {
    accountId: email,
    password,
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  const refreshToken = Cookies.get("refreshToken");
  if (refreshToken) {
    try {
      await axios.post(`${API_URL}/users/logout`, { refreshToken });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  Cookies.remove("token");
  Cookies.remove("refreshToken");
};

export const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = Cookies.get("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(`${API_URL}/users/refresh-token`, {
    refreshToken,
  });
  const { accessToken } = response.data;
  Cookies.set("token", accessToken, {
    expires: 60 * 60 * 1000,
  });
  return accessToken;
};

export const getDecodedToken = (): DecodedToken | null => {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const isTokenExpired = (): boolean => {
  const decoded = getDecodedToken();
  if (!decoded) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

export const isAdmin = (): boolean => {
  const decoded = getDecodedToken();
  return decoded?.user.role === "superadmin";
};
