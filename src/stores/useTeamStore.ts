import { create } from "zustand";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

interface TeamStore {
  teams: Team[];
  fetchTeams: () => Promise<void>;
}

const useTeamStore = create<TeamStore>((set) => ({
  teams: [],

  fetchTeams: async () => {
    const apiClient = new APIClient("/api/teams");
    try {
      const response = await apiClient.getTeams();
      console.log("API Response:", response);
      if (response && response.data) {
        set({ teams: response.data });
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching teams: ", error);
    }
  },
}));

export default useTeamStore;
