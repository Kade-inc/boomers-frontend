import { create, StateCreator } from "zustand";
import Cookies from "js-cookie";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, PersistOptions } from "zustand/middleware";
import User from "../entities/User";

interface AuthStore {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  userId: string;
  setUserId: (userId: string) => void;
  user: User;
  setUser: (user: User) => void;
}

type MyPersist = (
  config: StateCreator<AuthStore>,
  options: PersistOptions<AuthStore>,
) => StateCreator<AuthStore>;

const useAuthStore = create<AuthStore>(
  (persist as MyPersist)(
    (set) => ({
      isAuthenticated: !!Cookies.get("token"), // Initialize from cookie
      user: {},
      userId: "",
      login: (token: string) => {
        Cookies.set("token", token, {
          expires: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true, // The cookie is only accessible by the web server
          secure: true,
          sameSite: "None",
        });

        set({ isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove("token");
        set({ isAuthenticated: false, user: {}, userId: "" });
      },
      setUserId: (userId: string) => set(() => ({ userId })),
      setUser: (user: User) => set(() => ({ user })),
      clearToken: () => set({ user: {}, userId: "", isAuthenticated: false }), // Clear all user info
    }),
    {
      name: "auth-storage", // This persists the store's state
    },
  ),
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Auth Store", useAuthStore);
}

export default useAuthStore;
