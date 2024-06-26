import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

interface NameStore {
  name: string;
}
const useNameStore = create<NameStore>(() => ({
  name: "Boomers",
}));

// Inspect store
if (process.env.NODE_ENV === "development")
  mountStoreDevtool("Name Store", useNameStore);

export default useNameStore;
