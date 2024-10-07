import { create } from "zustand";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";
import Challenge from "../entities/Challenge";
import Request from "../entities/Request";

interface TeamStore {
  teams: Team[];
  teamDetails: { [teamId: string]: Team | undefined };
  challenges: Challenge[];
  requests: Request[];
  fetchTeams: () => Promise<void>;
  fetchTeamData: (teamId: string) => Promise<void>; // Combined method
}

const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  teamDetails: {},
  challenges: [],
  requests: [],

  fetchTeams: async () => {
    const apiClient = new APIClient("/api/teams");
    try {
      const response = await apiClient.getTeams();
      if (response && response.data) {
        set({ teams: response.data as Team[] });
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching teams: ", error);
    }
  },

  fetchTeamData: async (teamId: string) => {
    const apiClient = new APIClient(`/api/teams/${teamId}`);
    try {
      // Fetch team details
      const teamDetailsResponse = await apiClient.getTeamDetails(teamId);
      if (teamDetailsResponse && teamDetailsResponse.data) {
        set((state) => ({
          teamDetails: {
            ...state.teamDetails,
            [teamId]: teamDetailsResponse.data as Team,
          },
        }));
      } else {
        console.error(
          "Unexpected response structure for team details:",
          teamDetailsResponse,
        );
      }

      // Fetch challenges
      const challengesResponse = await apiClient.getChallenges(teamId);
      if (challengesResponse && challengesResponse.data) {
        set({ challenges: challengesResponse.data });
      } else {
        console.error(
          "Unexpected response structure for challenges:",
          challengesResponse,
        );
      }

      // Fetch requests
      const requestsResponse = await apiClient.getRequests(teamId);
      if (requestsResponse && requestsResponse.data) {
        set({ requests: requestsResponse.data });
      } else {
        console.error(
          "Unexpected response structure for requests:",
          requestsResponse,
        );
      }
    } catch (error) {
      console.error("Error fetching team data: ", error);
    }
  },
}));

export default useTeamStore;

// http://localhost:5001/api/team-member/requests/66f539829a718cd0e571b68d
//http://localhost:5001/api/teams/66f539829a718cd0e571b68d/challenges
