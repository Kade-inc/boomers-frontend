import { create } from "zustand";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

interface TeamStore {
  teams: Team[];
  teamDetails: { [teamId: string]: Team | undefined };
  fetchTeams: () => Promise<void>;
  fetchTeamDetails: (teamId: string) => Promise<void>;
}

const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  teamDetails: {},

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
}));

export default useTeamStore;
