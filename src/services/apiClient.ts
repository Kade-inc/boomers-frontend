/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance } from "axios";
import User from "../entities/User";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { UserVerificationModel } from "../entities/UserVerificationModel";
import { jwtDecode } from "jwt-decode";
import useAuthStore from "../stores/useAuthStore";
import Team from "../entities/Team";
import { ExtendedChallengeInterface } from "../entities/Challenge";

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

    // Add the request interceptor to conditionally include the Bearer token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Only add the Authorization header if requiresAuth is set to true
        const requiresAuth = config.headers?.requiresAuth;
        if (requiresAuth) {
          const token = this.getToken();
          if (token) config.headers.Authorization = `Bearer ${token}`;
        }
        // Remove requiresAuth from headers to avoid sending it in the request
        delete config.headers.requiresAuth;
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Add the response interceptor to handle 401 errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
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
        return Promise.reject(error);
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
      throw axiosError;
    }
  };

  getUserProfile = async (requiresAuth = true) => {
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
            requiresAuth,
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
  getTeams = async (userId?: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}?userId=${userId}`,
        {
          headers: {
            requiresAuth,
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
  getTeamDetails = async (teamId: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${teamId}`,
        {
          headers: {
            requiresAuth,
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

  getTeamChallenges = async (teamId: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${teamId}/challenges`,
        {
          headers: {
            requiresAuth,
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

  getAllChallenges = async (
    userId: string,
    valid: boolean,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}?userId=${userId}&valid=${valid}`,
        {
          headers: {
            requiresAuth,
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

  getChallenge = async (challengeId: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${challengeId}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching challenge:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  getTeamMemberRequests = async (teamId: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/requests/${teamId}`,
        {
          headers: {
            requiresAuth,
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

  getTeamRecommendations = async (requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(`${this.endpoint}`, {
        headers: {
          requiresAuth,
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

  getAdvice = async (requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(`${this.endpoint}`, {
        headers: {
          requiresAuth,
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

  getDomains = async (requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(`${this.endpoint}`, {
        headers: {
          requiresAuth,
        },
      });
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching Domains",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  getSubDomains = async (parentDomain: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${parentDomain}/subdomains`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching Sub domains",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  getDomainTopics = async (requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(`${this.endpoint}`, {
        headers: {
          requiresAuth,
        },
      });
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching Sub domains",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  createTeam = async (data: Team, requiresAuth = true): Promise<any> => {
    try {
      const response = await this.axiosInstance.post(this.endpoint, data, {
        headers: {
          requiresAuth,
        },
      });

      const responseData = response.data;
      return responseData;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  };

  logout = async () => {
    try {
      const response = await this.axiosInstance.post(`${this.endpoint}`, {
        token: Cookies.get("token"),
      });
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

  deleteChallenges = async (
    payload: { challengeIds: string[] },
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.delete(`${this.endpoint}`, {
        headers: {
          requiresAuth,
        },
        data: payload,
      });
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error Deleting challenge(s):",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  createChallenge = async (
    teamId: string,
    requiresAuth = true,
  ): Promise<ExtendedChallengeInterface> => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}/${teamId}/challenges`,
        null,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      return data;
    } catch (error: any) {
      let errorMessage =
        "An unexpected error occurred. Please try again later.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(`${errorMessage}`);
      throw new Error(errorMessage);
    }
  };

  updateChallenge = async (
    teamId: string,
    challengeId: string,
    payload: Partial<ExtendedChallengeInterface>,
    requiresAuth = true,
  ): Promise<ExtendedChallengeInterface> => {
    try {
      const response = await this.axiosInstance.put(
        `${this.endpoint}/${teamId}/challenges/${challengeId}`,
        payload,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      return data;
    } catch (error: any) {
      let errorMessage =
        "An unexpected error occurred. Please try again later.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(`${errorMessage}`);
      throw new Error(errorMessage);
    }
  };
  updateUserProfile = async (
    userId: string,
    updatedProfile: FormData,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.put(
        `${this.endpoint}/${userId}/profile`,
        updatedProfile,
        {
          headers: {
            requiresAuth,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Profile updated successfully");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error updating profile: ",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };
}

export default APIClient;
