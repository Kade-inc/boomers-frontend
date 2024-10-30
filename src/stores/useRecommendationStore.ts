import { create, StateCreator } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, PersistOptions } from "zustand/middleware";
import Team from "../entities/Team";

interface RecommendationStore {
  recommendations: Team[];
  setRecommendations: (teams: Team[]) => void;
}

type RecommendationPersist = (
  config: StateCreator<RecommendationStore>,
  options: PersistOptions<RecommendationStore>,
) => StateCreator<RecommendationStore>;

const useRecommendationStore = create<RecommendationStore>(
  (persist as RecommendationPersist)(
    (set) => ({
      recommendations: [],
      setRecommendations: (recommendations: Team[]) =>
        set(() => ({ recommendations })),
    }),
    {
      name: "recommendation-storage", // This persists the store's state
    },
  ),
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Recommendation Store", useRecommendationStore);
}

export default useRecommendationStore;
