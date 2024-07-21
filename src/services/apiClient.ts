import axios, { AxiosError, AxiosInstance } from "axios";
import User from "../entities/User";
import toast from "react-hot-toast";
import verifyUser from "../entities/verifyUser";

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
      const response = await this.axiosInstance.post(
        "api/users/register",
        data
      );
      //   console.log("Signup successful:", response.data);
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

  verifyUser = async (data:verifyUser) => {
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
}

export default APIClient;
