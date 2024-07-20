import axios, { AxiosError, AxiosInstance } from "axios";
import User from "../entities/User";
import toast from "react-hot-toast";

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

  verifyUser = async ({ queryKey }: { queryKey: [string, string] }) => {
    const [accountId, verificationCode] = queryKey;
   return await this.axiosInstance.post(this.endpoint, {accountId, verificationCode})
   .then(res => res.data)
  } 
}

export default APIClient;
