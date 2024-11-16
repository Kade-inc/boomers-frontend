import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

// Add this to your Zustand store
interface LoadingStore {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set(() => ({ isLoading: loading })),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Loading Store", useLoadingStore);
}

export default useLoadingStore;
