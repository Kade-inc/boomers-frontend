/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance } from "axios";
import User from "../entities/User";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { UserVerificationModel } from "../entities/UserVerificationModel";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "../stores/useAuthStore";

class APIClient {
  endpoint: string;
  axiosInstance: AxiosInstance;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:5001",
    });
  }

  signup = async (data: User): Promise<any> => {
    try {
      const response = await this.axiosInstance.post(this.endpoint, data);
      console.log("Verification code:", response.data);
      toast.success("Signup successful");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Signup error:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  verifyUser = async (data: UserVerificationModel) => {
    try {
      const res = await this.axiosInstance.post(this.endpoint, data);
      return res.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Verification error:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  signin = async (data: User): Promise<any> => {
    const { login } = useAuthStore.getState();

    try {
      const response = await this.axiosInstance.post(this.endpoint, data);
      const { accessToken } = response.data;

      Cookies.set("jwt", accessToken, { expires: 7 });
      login(accessToken);

      toast.success("Login successful");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Login error: " + (axiosError.response?.data ?? axiosError.message),
      );
      throw axiosError;
    }
  };

  forgotPassword = async (email: string) => {
    try {
      const response = await this.axiosInstance.post(this.endpoint, { email });
      toast.success("Reset password link sent");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Forgot password error:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getUserProfile = async () => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${this.decodeToken().aud}/profile`,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );
      console.log("RESPONSE: ", response.data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Could not load user profile:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getToken = () => {
    const token = Cookies.get("jwt");
    if (!token) {
      throw new Error("JWT token is missing");
    }
    return token;
  };

  decodeToken = () => {
    const value: any = Cookies.get("jwt");
    const decoded = jwtDecode(value);

    return decoded;
  };
}

export default APIClient;
