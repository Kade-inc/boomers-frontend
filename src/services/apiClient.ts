import axios, { AxiosError, AxiosInstance } from "axios";
import User from "../entities/User";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { UserVerificationModel } from "../entities/UserVerificationModel";

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
        axiosError.response?.data ?? axiosError.message
      );
      throw axiosError;
    }
  };

  verifyUser = async (data:UserVerificationModel) => {
    try {
      const res = await this.axiosInstance.post(this.endpoint, data);
   return res.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Verification error:", axiosError.response?.data ?? axiosError.message
      );
      throw axiosError;
    }
   
  } 
  signin = async (data: User): Promise<any> => {
    try {
      const response = await this.axiosInstance.post(this.endpoint, data);
      console.log("Login successful:", response.data);
      Cookies.set("jwt", response.data.token, { expires: 7 });
      toast.success("Login successful");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Login error:",
        axiosError.response?.data ?? axiosError.message
      );
      throw axiosError;
    }
  };

  forgotPassword = async (email: string) => {
    try {
      const response = await this.axiosInstance.post(this.endpoint, { email });
      toast.success('Reset password link sent');
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Forgot password error:", axiosError.response?.data ?? axiosError.message
      );
      throw axiosError;
    }
  };
}

export default APIClient;
