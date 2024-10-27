/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance } from "axios";
import User from "../entities/User";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { UserVerificationModel } from "../entities/UserVerificationModel";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "../stores/useAuthStore";

interface ErrorResponse {
  message: string;
}

class APIClient {
  endpoint: string;
  axiosInstance: AxiosInstance;

  constructor(endpoint: string = "") {
    this.endpoint = endpoint;
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:5001",
    });

    // Add the response interceptor to handle 401 errors
    this.axiosInstance.interceptors.response.use(
      (response) => response, // If the response is successful, return it
      (error) => {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          const logout = useAuthStore.getState().logout;
          logout();

          toast.error(
            "Session expired. You have been logged out.",
            axiosError.response?.data ?? axiosError.message,
          );
        }
        return Promise.reject(error); // Forward the error
      },
    );
  }

  signup = async (data: User): Promise<any> => {
    try {
      const response = await this.axiosInstance.post(this.endpoint, data);
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
    const { login, setUserId } = useAuthStore.getState();

    try {
      const response = await this.axiosInstance.post(this.endpoint, data);
      const { accessToken } = response.data;

      Cookies.set("token", accessToken, { expires: 365 * 24 * 60 * 60 * 1000 });
      login(accessToken);
      setUserId(this.decodeToken().aud);
      toast.success("Login successful");
      this.getUserProfile();
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError;
      toast.error(
        (axiosError.response?.data as ErrorResponse)?.message ??
          axiosError.message,
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

  resetPassword = async (userId: string, password: string, token: string) => {
    try {
      const response = await this.axiosInstance.post(this.endpoint, {
        userId,
        password,
        token,
      });
      toast.success("Password reset successfully");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data ?? axiosError.message;
      toast.error(`Reset Password Error: ${errorMessage}`);
      throw axiosError;
    }
  };

  getUserProfile = async () => {
    const { userId } = useAuthStore.getState();

    //TODO: FIX THIS. It should follow the structure of all other methods
    // The issue is occuring since we have to call the endpoint in the
    // login method
    const prefix = "api/users";

    try {
      const response = await this.axiosInstance.get(
        `${prefix}/${userId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );

      const { profile } = response.data;
      const { setUser } = useAuthStore.getState();
      setUser(profile);
      return profile;
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
    return Cookies.get("token");
  };

  decodeToken = (): any => {
    const value: any = Cookies.get("token");
    const decoded = jwtDecode(value);

    return decoded;
  };

  // Fetch Teams
  getTeams = async (userId?: string) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching teams:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  // Fetch Team members
  getTeamDetails = async (teamId: string) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching team details",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  getTeamChallenges = async (teamId: string) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${teamId}/challenges`,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching challenges:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  getAllChallenges = async (userId: string) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching challenges:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  getTeamMemberRequests = async (teamId: string) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/requests/${teamId}`,
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );
      const { data } = response.data;
      if (data.length < 1) {
        toast.error("No Member requests");
      }
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching member requests:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  getTeamRecommendations = async () => {
    try {
      const response = await this.axiosInstance.get(`${this.endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching team Recommendations:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  getAdvice = async () => {
    try {
      const response = await this.axiosInstance.get(`${this.endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      });
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching Advice",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  logout = async () => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}`,
        { token: Cookies.get("token") },
        {
          headers: {
            Authorization: `Bearer ${this.getToken()}`,
          },
        },
      );
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error Logging out",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };
}

export default APIClient;
