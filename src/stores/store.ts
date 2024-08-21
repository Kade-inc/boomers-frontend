import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

interface SignUpStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  signUpSuccess: boolean;
}

const useSignUpStore = create<SignUpStore>((set) => ({
  signUpSuccess: false,
  setSignUpSuccess: (signUpSuccess: boolean) => set(() => ({ signUpSuccess })),
}));

// Inspect store
if (process.env.NODE_ENV === "development")
  mountStoreDevtool("SignUp Store", useSignUpStore);

export default useSignUpStore;
