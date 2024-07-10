import axios, { AxiosError, AxiosInstance } from "axios";
import User from "../entities/User";

class APIClient {
  endpoint: string;
  axiosInstance: AxiosInstance;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:5000",
    });
  }

  signup = async (data: User): Promise<any> => {
    try {
      const response = await this.axiosInstance.post(
        "api/users/register",
        data
      );
      console.log("Signup successful:", response.data);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      console.error(
        "Signup error:",
        axiosError.response?.data ?? axiosError.message
      );
      throw axiosError;
    }
  };
}

export default APIClient;
