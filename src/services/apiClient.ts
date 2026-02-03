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
import JoinRequest from "../entities/JoinRequest";
import { ChallengeSolution } from "../entities/ChallengeSolution";
import { SolutionStepComment } from "../entities/SolutionStepComment";
import { ChallengeStep } from "../entities/ChallengeStep";
import { SolutionComment } from "../entities/SolutionComment";

interface ErrorResponse {
  message: string;
}

class APIClient {
  endpoint: string;
  axiosInstance: AxiosInstance;

  constructor(endpoint: string = "") {
    this.endpoint = endpoint;
    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:5001",
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
      async (error) => {
        const axiosError = error as AxiosError;
        const originalRequest = error.config;

        if (axiosError.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Prevent infinite loop
          try {
            const refresh_token = Cookies.get("refreshToken");
            if (!refresh_token) {
              throw new Error("No refresh token found");
            }

            const response = await this.axiosInstance.post(
              "api/users/refresh-token",
              {
                refreshToken: refresh_token,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );

            const { accessToken, refreshToken } = response.data;
            Cookies.set("token", accessToken, {
              expires: 60 * 60 * 1000,
            });
            Cookies.set("refreshToken", refreshToken, {
              expires: 7 * 24 * 60 * 60 * 1000,
            });
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.axiosInstance(originalRequest);
          } catch {
            const logout = useAuthStore.getState().logout;
            logout();
          }
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
    const { login, setUserId, setUserTeams } = useAuthStore.getState();

    try {
      const response = await this.axiosInstance.post(this.endpoint, data);
      const { accessToken, refreshToken } = response.data;

      // Set token in cookie and update auth state
      Cookies.set("token", accessToken, { expires: 60 * 60 * 1000 });
      Cookies.set("refreshToken", refreshToken, {
        expires: 7 * 24 * 60 * 60 * 1000,
      });
      login(accessToken);

      // Decode token to extract userId and set in auth state
      const userId = this.decodeToken().aud;
      setUserId(userId);

      // Fetch teams by passing userId and update global state
      const teamsResponse = await this.getTeams({ userId });
      if (teamsResponse.data) {
        const teams = teamsResponse.data || teamsResponse;
        setUserTeams(teams);
      }
      await this.getUserProfile();
      toast.success("Login successful");
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

  // Function to get all users
  getUsers(searchQuery?: string, requiresAuth = true) {
    const url = searchQuery
      ? `${this.endpoint}?search=${searchQuery}`
      : `${this.endpoint}`;

    return this.axiosInstance
      .get(url, {
        headers: {
          requiresAuth,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  // Get a user
  getUserProfileById = async (userId: string, requiresAuth = true) => {
    const url = `${this.endpoint}/${userId}/profile`;
    try {
      const response = await this.axiosInstance.get(url, {
        headers: {
          requiresAuth,
        },
      });
      return response.data.profile;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching User profile:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  // Get all join requests
  getAllJoinRequests = async (requiresAuth = true): Promise<JoinRequest[]> => {
    try {
      const response = await this.axiosInstance.get(`${this.endpoint}`, {
        headers: {
          requiresAuth,
        },
      });
      return response.data.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching join requests:",
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
  getTeams = async (
    params: {
      userId?: string;
      page?: number;
      limit?: number;
      domain?: string;
      subdomain?: string;
      subdomainTopics?: string;
      name?: string;
    },
    requiresAuth = true,
  ) => {
    //TODO: FIX THIS. It should follow the structure of all other methods
    // The issue is occuring since we have to call the endpoint in the
    // login method
    const prefix = "api/teams";

    try {
      const response = await this.axiosInstance.get(`${prefix}`, {
        params,
        headers: {
          requiresAuth,
        },
      });

      return response.data;
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
      throw new Error(axiosError.message);
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

  getAllSubDomains = async (requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/subdomains`,
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
        "Error fetching all subdomains",
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
        "Error fetching Domain Topics",
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
    const { logout } = useAuthStore.getState();

    try {
      const response = await this.axiosInstance.post(`${this.endpoint}`, {
        token: Cookies.get("token"),
      });
      const { data } = response.data;
      logout();
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
      toast.success(`Challenges deleted successfully!`);
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error Deleting challenge(s):",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  deleteChallenge = async (
    teamId: string,
    challengeId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/${teamId}/challenges/${challengeId}`,
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

  getChallengeComments = async (challengeId: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${challengeId}/comments`,
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
        "Error fetching challenge comments:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  deleteChallengeComment = async (
    challengeId: string,
    commentId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/${challengeId}/comments/${commentId}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      toast.success("Comment deleted successfully");
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error delete challenge comments:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  postChallengeComment = async (
    challengeId: string,
    comment: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}/${challengeId}/comments`,
        { comment },
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      toast.success("Comment posted successfully");
      return data;
    } catch (error: any) {
      const axiosError = error as AxiosError;
      toast.error(
        `Error posting challenge comment: ${axiosError.response?.data ?? axiosError.message
        }`,
      );
      throw error; // Throw the error to allow React Query to handle it
    }
  };
  // Leave Team
  leaveTeam = async (teamId: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.delete(
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
        "Error leaving the team",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  // Remove Team Member
  removeTeamMember = async (
    teamId: string,
    userId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.delete(this.endpoint, {
        headers: {
          requiresAuth,
        },
        params: {
          teamId,
          userId,
        },
      });
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error removing the team member",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  // Join Team Request
  joinTeamRequest = async (
    requestId: string,
    payload: { status: string; comment: string },
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.put(
        `${this.endpoint}/${requestId}`,
        payload,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      toast.success(`Request ${payload.status.toLowerCase()} successfully!`);
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Failed to update request.",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  // Add Team member
  addTeamMember = async (
    payload: { team_id: string; username: string },
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}`,
        payload,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      toast.success(`Added successfully`);
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Failed to add member.",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  // Add Team Request
  addTeamRequest = async (
    payload: { team_id: string; user_id?: string },
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}`,
        payload,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      toast.success(`Request sent successfully`);
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Failed to send Request.",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  getNotifications = async (requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(this.endpoint, {
        headers: {
          requiresAuth,
        },
      });
      const { data } = response.data;
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching notifications:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  updateNotificationStatus = async (
    notificationId: string,
    isRead: boolean,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.patch(
        `${this.endpoint}/${notificationId}`,
        {
          isRead: isRead,
        },
        {
          headers: {
            requiresAuth,
          },
        },
      );
      // toast.success("Notification marked as read");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error updating notification status: ",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  markAllNotificationsAsRead = async (requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.patch(
        `${this.endpoint}`,
        {},
        {
          headers: {
            requiresAuth,
          },
        },
      );
      // toast.success("All notifications marked as read");
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error marking all notifications as read: ",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  deleteProfilePicture = async (userId: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/${userId}/profile-picture`,
        {
          headers: {
            requiresAuth,
          },
        },
      );

      return response;
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

  getTeamSpotlight = async (requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(this.endpoint, {
        headers: {
          requiresAuth,
        },
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching team spotlight:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  getSearchResults = async (query: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}?q=${query}`,
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
        "Error fetching search results:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getSearchHistory = async (requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.get(this.endpoint, {
        headers: {
          requiresAuth,
        },
      });
      return response.data.data || response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching search history:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  clearSearchHistory = async (requiresAuth = true) => {
    try {
      await this.axiosInstance.delete(this.endpoint, {
        headers: {
          requiresAuth,
        },
      });
      toast.success("Search history cleared successfully");
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error clearing search history:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getAllSearchTeams = async (
    query: string,
    page: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}?q=${query}&page=${page}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching all search teams:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getAllSearchChallenges = async (
    query: string,
    page: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}?q=${query}&page=${page}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching all search challenges:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getAllSearchProfiles = async (
    query: string,
    page: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}?q=${query}&page=${page}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching all search profiles:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  updateTeam = async (
    teamId: string,
    payload: Partial<Team>,
    requiresAuth = true,
  ): Promise<Team> => {
    try {
      const response = await this.axiosInstance.put(
        `${this.endpoint}/${teamId}`,
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

  getSolution = async (
    challengeId: string,
    solutionId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data.data || response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching solution:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getAllChallengeSolutions = async (
    challengeId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${challengeId}/solutions`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data.data || response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching challenge solutions:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  postChallengeSolution = async (challengeId: string, requiresAuth = true) => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}/${challengeId}/solutions`,
        {},
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      toast.success("Starting solution...");
      return data;
    } catch (error: any) {
      const axiosError = error as AxiosError;
      toast.error(
        `Error beginning challenge solution: ${axiosError.response?.data ?? axiosError.message
        }`,
      );
      throw error; // Throw the error to allow React Query to handle it
    }
  };

  addSolutionStep = async (
    challengeId: string,
    solutionId: string,
    description: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/steps`,
        { description },
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError;
      toast.error(
        `Error adding solution step: ${axiosError.response?.data ?? axiosError.message
        }`,
      );
      throw error; // Throw the error to allow React Query to handle it
    }
  };

  updateSolutionStep = async (
    challengeId: string,
    solutionId: string,
    stepId: string,
    payload: Partial<ChallengeStep>,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.patch(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/steps/${stepId}`,
        payload,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError;
      toast.error(
        `Error updating solution step: ${axiosError.response?.data ?? axiosError.message
        }`,
      );
      throw error; // Throw the error to allow React Query to handle it
    }
  };

  deleteSolutionStep = async (
    challengeId: string,
    solutionId: string,
    stepId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/steps/${stepId}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      const { data } = response.data;
      toast.success("Step deleted successfully");
      return data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error delete challenge step:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  updateSolution = async (
    challengeId: string,
    solutionId: string,
    payload: Partial<ChallengeSolution>,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.patch(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}`,
        payload,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError;
      toast.error(
        `Error updating solution: ${axiosError.response?.data ?? axiosError.message
        }`,
      );
      throw error; // Throw the error to allow React Query to handle it
    }
  };

  getSolutionStepComments = async (
    challengeId: string,
    stepId: string,
    solutionId: string,
    requiresAuth = true,
  ): Promise<SolutionStepComment[]> => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/steps/${stepId}/comments`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data.data || response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching solution step comments:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getSolutionStepCommentById = async (
    challengeId: string,
    stepId: string,
    solutionId: string,
    commentId: string,
    requiresAuth = true,
  ): Promise<SolutionStepComment> => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/steps/${stepId}/comments/${commentId}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data.data || response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching solution step comment:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  postSolutionStepComment = async (
    challengeId: string,
    stepId: string,
    solutionId: string,
    comment: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/steps/${stepId}/comments`,
        { comment },
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error posting solution step comment:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  updateSolutionStepComment = async (
    challengeId: string,
    stepId: string,
    solutionId: string,
    commentId: string,
    comment: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.patch(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/steps/${stepId}/comments/${commentId}`,
        { comment },
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error updating solution step comment:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  deleteSolutionStepComment = async (
    challengeId: string,
    stepId: string,
    solutionId: string,
    commentId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/steps/${stepId}/comments/${commentId}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error deleting solution step comment:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getSolutionComments = async (
    challengeId: string,
    solutionId: string,
    requiresAuth = true,
  ): Promise<SolutionComment[]> => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/comments`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data.data || response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching solution comments:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  postSolutionComment = async (
    challengeId: string,
    solutionId: string,
    comment: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/comments`,
        { comment },
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error posting solution comment:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  updateSolutionComment = async (
    challengeId: string,
    solutionId: string,
    commentId: string,
    comment: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.patch(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/comments/${commentId}`,
        { comment },
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error updating solution comment:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  deleteSolutionComment = async (
    challengeId: string,
    solutionId: string,
    commentId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/comments/${commentId}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error deleting solution comment:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  deleteChallengeSolution = async (
    challengeId: string,
    solutionId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error deleting challenge solution:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getSolutionRatings = async (
    challengeId: string,
    solutionId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/rating`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data.data || response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching solution rating:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  postSolutionRating = async (
    challengeId: string,
    solutionId: string,
    rating: number,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/rating`,
        { rating },
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data.data || response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error posting solution rating:",
        axiosError.response?.data ?? axiosError.message,
      );
    }
  };

  updateSolutionRating = async (
    challengeId: string,
    solutionId: string,
    ratingId: string,
    rating: number,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.patch(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/rating/${ratingId}`,
        { rating },
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data.data || response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error updating solution rating:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  deleteSolutionRating = async (
    challengeId: string,
    solutionId: string,
    ratingId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/rating/${ratingId}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error deleting solution rating:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getSolutionRatingById = async (
    challengeId: string,
    solutionId: string,
    ratingId: string,
    requiresAuth = true,
  ) => {
    try {
      const response = await this.axiosInstance.get(
        `${this.endpoint}/${challengeId}/solutions/${solutionId}/rating/${ratingId}`,
        {
          headers: {
            requiresAuth,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching solution rating by id:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  addDomain = async (domain: string) => {
    try {
      const response = await this.axiosInstance.post(
        "/api/domains",
        { name: domain },
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error adding domain:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  addSubdomain = async (subdomain: string, parentId: string) => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}/${parentId}/subdomains`,
        { name: subdomain },
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error adding subdomain:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  addDomainTopic = async (topic: string, parentId: string) => {
    try {
      const response = await this.axiosInstance.post(
        `${this.endpoint}/domainTopics`,
        { name: topic, parentSubdomain: parentId },
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error adding domain topic:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  updateDomain = async (domainId: string, domain: string) => {
    try {
      const response = await this.axiosInstance.put(
        `${this.endpoint}/${domainId}`,
        { name: domain },
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error updating domain:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  updateSubdomain = async (subdomainId: string, subdomain: string) => {
    try {
      const response = await this.axiosInstance.put(
        `${this.endpoint}/subdomains/${subdomainId}`,
        { name: subdomain },
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error updating subdomain:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  updateDomainTopic = async (topicId: string, topic: string) => {
    try {
      const response = await this.axiosInstance.put(
        `${this.endpoint}/domainTopics/${topicId}`,
        { name: topic },
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error updating domain topic:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  deleteDomain = async (domainId: string) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/${domainId}`,
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error deleting domain:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  deleteSubdomain = async (subdomainId: string) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/subdomains/${subdomainId}`,
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error deleting subdomain:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  deleteDomainTopic = async (topicId: string) => {
    try {
      const response = await this.axiosInstance.delete(
        `${this.endpoint}/domainTopics/${topicId}`,
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error deleting domain topic:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  getChats = async (userId: string) => {
    try {
      const response = await this.axiosInstance.get(`/api/chats/${userId}`, {
        headers: {
          requiresAuth: true,
        },
      });
      return response.data.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error fetching chats:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  searchUsersAndTeams = async (
    query: string,
    page: number,
    pageSize: number,
  ) => {
    try {
      const response = await this.axiosInstance.get(
        `/api/search/chat?q=${query}`,
        {
          headers: {
            requiresAuth: true,
          },
          params: {
            page,
            pageSize,
          },
        },
      );
      return response.data.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error(
        "Error searching for users and teams:",
        axiosError.response?.data ?? axiosError.message,
      );
      throw axiosError;
    }
  };

  // Create a short URL for sharing
  createShortUrl = async (
    originalUrl: string,
    resourceType: "challenge" | "solution" | "team",
    resourceId: string,
  ): Promise<{ shortUrl: string; code: string; isExisting: boolean }> => {
    try {
      const response = await this.axiosInstance.post("/api/short-urls", {
        originalUrl,
        resourceType,
        resourceId,
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error("Error creating short URL");
      throw axiosError;
    }
  };

  // Get messages for a chat
  getMessages = async (chatId: string) => {
    try {
      const response = await this.axiosInstance.get(`/api/messages/${chatId}`, {
        headers: {
          requiresAuth: true,
        },
      });
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error("Error fetching messages");
      throw axiosError;
    }
  };

  // Send a message
  sendMessage = async (chatId: string, text: string) => {
    try {
      const response = await this.axiosInstance.post(
        `/api/messages`,
        { chatId, text },
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error("Error sending message");
      throw axiosError;
    }
  };

  // Create a new chat
  createChat = async (members: string[]) => {
    try {
      const response = await this.axiosInstance.post(
        `/api/chats`,
        { members },
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      // Don't show error for existing chat (409)
      if (axiosError.response?.status !== 409) {
        toast.error("Error creating chat");
      }
      throw axiosError;
    }
  };

  // Create a group chat for a team
  createGroupChat = async (
    teamId: string,
    groupName: string,
    teamColor?: string,
  ) => {
    try {
      const response = await this.axiosInstance.post(
        `/api/chats/group`,
        { teamId, groupName, teamColor },
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      toast.error("Error creating group chat");
      throw axiosError;
    }
  };

  // Find a chat by members
  findChat = async (members: string[]) => {
    try {
      const response = await this.axiosInstance.get(
        `/api/chats/find?members=${members.join(",")}`,
        {
          headers: {
            requiresAuth: true,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  };
}

export default APIClient;
