import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

interface NameStore {
  name: string;
}
const useNameStore = create<NameStore>(() => ({
  name: "Boomers",
}));

const useSignUpStore = create<SignUpStore>((set) => ({
  signUpSuccess: false,
  setSignUpSuccess: (signUpSuccess) => set(() => ({ signUpSuccess })),
}));

// Inspect store
if (process.env.NODE_ENV === "development")
  mountStoreDevtool("Name Store", useNameStore);

export default useSignUpStore;
