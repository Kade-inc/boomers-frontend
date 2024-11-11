import { create, StateCreator } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, PersistOptions } from "zustand/middleware";
import Challenge from "../entities/Challenge";

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
  currentStep?: number;
};

interface CreateChallengeStore {
  draftUserChallenges: ExtendedChallengeInterface[];
  setDraftUserChallenges: (
    draftUserChallenges: ExtendedChallengeInterface[],
  ) => void;
}

type ChallengesPersist = (
  config: StateCreator<CreateChallengeStore>,
  options: PersistOptions<CreateChallengeStore>,
) => StateCreator<CreateChallengeStore>;

const useCreateChallengeStore = create<CreateChallengeStore>(
  (persist as ChallengesPersist)(
    (set) => ({
      draftUserChallenges: [],
      setDraftUserChallenges: (
        draftUserChallenges: ExtendedChallengeInterface[],
      ) => set(() => ({ draftUserChallenges })),
    }),
    {
      name: "challenge-storage", // This persists the store's state
    },
  ),
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Create Challenge Store", useCreateChallengeStore);
}

export default useCreateChallengeStore;
