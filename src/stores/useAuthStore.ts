import { create, StateCreator } from "zustand";
import Cookies from "js-cookie";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { persist, PersistOptions } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import User from "../entities/User";
import Team from "../entities/Team";

interface AuthStore {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  userId: string;
  setUserId: (userId: string) => void;
  user: User;
  userTeams: Team[];
  setUser: (user: User) => void;
  checkAuth: () => void;
  token: string | null;
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
      token: null,
      userTeams: [],
      login: (token: string) => {
        Cookies.set("token", token, {
          expires: 365 * 24 * 60 * 60 * 1000,
          httpOnly: true, // The cookie is only accessible by the web server
          secure: true,
          sameSite: "None",
        });

        set({ token, isAuthenticated: true });
      },
      logout: () => {
        Cookies.remove("token");
        Cookies.remove("refreshToken");
        set({ isAuthenticated: false, user: {}, userId: "", token: null });
      },
      setUserId: (userId: string) => set(() => ({ userId })),
      setUser: (user: User) => set(() => ({ user })),
      clearToken: () => set({ user: {}, userId: "", isAuthenticated: false }), // Clear all user info
      checkAuth: () => {
        const token = Cookies.get("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            set({ token: null, isAuthenticated: false, user: {}, userId: "" });
            Cookies.remove("token");
            Cookies.remove("refreshToken");
          }
        } else {
          set({ token: null, isAuthenticated: false });
        }
      },
      setUserTeams: (teams: Team[]) => set(() => ({ userTeams: teams })),
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
