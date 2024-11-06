import { create } from "zustand";
import UserProfile from "../entities/UserProfile";

interface UserProfileStore {
  profileInfo: UserProfile | undefined;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setCurrentJob: (currentJob: string) => void;
  setCurrentLocation: (currentLocation: string) => void;
  setPhoneNumber: (phoneNumber: number) => void;
  setBio: (bio: string) => void;
  setInterests: (interests: string) => void;
}

const useUserProfileStore = create<UserProfileStore>((set) => ({
  profileInfo: undefined,
  setFirstName: (firstName) =>
    set((store) => ({
      profileInfo: store.profileInfo
        ? {
            ...store.profileInfo,
            profile: { ...store.profileInfo.profile, firstName },
          }
        : undefined,
    })),
  setLastName: (lastName) =>
    set((store) => ({
      profileInfo: store.profileInfo
        ? {
            ...store.profileInfo,
            profile: { ...store.profileInfo.profile, lastName },
          }
        : undefined,
    })),
  setCurrentJob: (currentJob) =>
    set((store) => ({
      profileInfo: store.profileInfo
        ? {
            ...store.profileInfo,
            profile: { ...store.profileInfo.profile, currentJob },
          }
        : undefined,
    })),
  setCurrentLocation: (currentLocation) =>
    set((store) => ({
      profileInfo: store.profileInfo
        ? {
            ...store.profileInfo,
            profile: { ...store.profileInfo.profile, currentLocation },
          }
        : undefined,
    })),
  setPhoneNumber: (phoneNumber) =>
    set((store) => ({
      profileInfo: store.profileInfo
        ? {
            ...store.profileInfo,
            profile: { ...store.profileInfo.profile, phoneNumber },
          }
        : undefined,
    })),
  setBio: (bio) =>
    set((store) => ({
      profileInfo: store.profileInfo
        ? {
            ...store.profileInfo,
            profile: { ...store.profileInfo.profile, bio },
          }
        : undefined,
    })),
  setInterests: (interests) =>
    set((store) => ({
      profileInfo: store.profileInfo
        ? {
            ...store.profileInfo,
            profile: { ...store.profileInfo.profile, interests },
          }
        : undefined,
    })),
}));

export default useUserProfileStore;
