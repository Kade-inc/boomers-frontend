import axios, { AxiosInstance } from "axios";
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
      return response.data;
    } catch (error) {
      throw error;
    }
  };
}

export default APIClient;
