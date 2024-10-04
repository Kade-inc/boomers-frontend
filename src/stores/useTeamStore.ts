import { create } from "zustand";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";
import Challenge from "../entities/Challenge";

interface TeamStore {
  teams: Team[];
  teamDetails: { [teamId: string]: Team | undefined };
  challenges: Challenge[];
  fetchTeams: () => Promise<void>;
  fetchTeamDetails: (teamId: string) => Promise<void>;
  fetchChallenges: (teamId: string) => Promise<void>;
}

const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  teamDetails: {},
  challenges: [],

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

  fetchTeamDetails: async (teamId: string) => {
    const apiClient = new APIClient(`/api/teams/${teamId}`);
    try {
      const response = await apiClient.getTeamDetails(teamId);
      if (response && response.data) {
        set((state) => ({
          teamDetails: {
            ...state.teamDetails,
            [teamId]: response.data as Team,
          },
        }));
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching team members: ", error);
    }
  },
  fetchChallenges: async (teamId: string) => {
    const apiClient = new APIClient(`/api/teams/${teamId}/challenges`);
    try {
      const response = await apiClient.getChallenges(teamId);
      console.log("Challenges Response:", response);
      if (response && response.data) {
        set({ challenges: response.data });
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching challenges: ", error);
    }
  },
}));

export default useTeamStore;

// http://localhost:5001/api/team-member/requests/66f4b50c2012ce4bc33dccc5
//http://localhost:5001/api/teams/66f4b50c2012ce4bc33dccc5/challenges
