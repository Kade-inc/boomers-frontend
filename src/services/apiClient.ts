import axios, { AxiosError, AxiosInstance } from "axios";
import User from "../entities/User";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

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
}

export default APIClient;
