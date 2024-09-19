import { create } from "zustand";
import Cookies from "js-cookie";
import { mountStoreDevtool } from "simple-zustand-devtools";

interface AuthStore {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: !!Cookies.get("jwt"),
  login: (token: string) => {
    Cookies.set("jwt", token, { expires: 7, secure: true, sameSite: "Strict" });
    set({ isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove("jwt");
    set({ isAuthenticated: false });
  },
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Auth Store", useAuthStore);
}

export default useAuthStore;
