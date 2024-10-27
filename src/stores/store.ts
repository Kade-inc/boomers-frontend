import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

interface SignUpStore {
  signUpSuccess: boolean;
  setSignUpSuccess: (signUpSuccess: boolean) => void;
}

const useSignUpStore = create<SignUpStore>()((set) => ({
  signUpSuccess: false,

  setSignUpSuccess: (signUpSuccess: boolean) => set(() => ({ signUpSuccess })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("SignUp Store", useSignUpStore);
}

export default useSignUpStore;
