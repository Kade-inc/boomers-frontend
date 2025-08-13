import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import Challenge from "../entities/Challenge";
import Team from "../entities/Team";

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
  currentStep?: number;
};

interface CreateChallengeStore {
  draftUserChallenges: ExtendedChallengeInterface[];
  currentEditingChallenge: ExtendedChallengeInterface | null;
  selectedTeams: Team[];
  setDraftUserChallenges: (
    draftUserChallenges: ExtendedChallengeInterface[],
  ) => void;
  setCurrentEditingChallenge: (
    currentEditingChallenge: ExtendedChallengeInterface | null,
  ) => void;
  setSelectedTeams: (selectedTeam: Team[]) => void;
}

const useCreateChallengeStore = create<CreateChallengeStore>((set) => ({
  draftUserChallenges: [],
  currentEditingChallenge: null,
  selectedTeams: [],
  setDraftUserChallenges: (draftUserChallenges: ExtendedChallengeInterface[]) =>
    set(() => ({ draftUserChallenges })),
  setCurrentEditingChallenge: (
    currentEditingChallenge: ExtendedChallengeInterface | null,
  ) => set(() => ({ currentEditingChallenge })),
  setSelectedTeams: (selectedTeams: Team[]) => set(() => ({ selectedTeams })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Create Challenge Store", useCreateChallengeStore);
}

export default useCreateChallengeStore;
