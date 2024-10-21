import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

interface SignUpStore extends AuthState {
  signUpSuccess: boolean;
  setSignUpSuccess: (signUpSuccess: boolean) => void;
}

const useSignUpStore = create<SignUpStore>()(
  persist(
    (set) => ({
      signUpSuccess: false,
      token: null,
      isAuthenticated: false,

      setSignUpSuccess: (signUpSuccess: boolean) =>
        set(() => ({ signUpSuccess })),

      login: (token: string) => {
        Cookies.set("token", token);
        set({ token, isAuthenticated: true });
      },

      logout: () => {
        Cookies.remove("token");
        set({ token: null, isAuthenticated: false });
      },

      checkAuth: () => {
        const token = Cookies.get("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            set({ token, isAuthenticated: true });
          } else {
            set({ token: null, isAuthenticated: false });
            Cookies.remove("token");
          }
        } else {
          set({ token: null, isAuthenticated: false });
        }
      },
    }),
    { name: "auth-storage" },
  ),
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("SignUp Store", useSignUpStore);
}

export default useSignUpStore;
