import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '../types';

interface ProfileState {
  profiles: Profile[];
  currentProfileId: string | null;
  addProfile: (profile: Omit<Profile, 'id' | 'createdAt'>) => void;
  updateProfile: (id: string, profile: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  setCurrentProfile: (id: string) => void;
  getCurrentProfile: () => Profile | null;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      currentProfileId: null,

      addProfile: (profile) => {
        const newProfile: Profile = {
          ...profile,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          currentProfileId: newProfile.id,
        }));
      },

      updateProfile: (id, profile) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...profile } : p
          ),
        }));
      },

      deleteProfile: (id) => {
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          currentProfileId:
            state.currentProfileId === id ? null : state.currentProfileId,
        }));
      },

      setCurrentProfile: (id) => {
        set({ currentProfileId: id });
      },

      getCurrentProfile: () => {
        const { profiles, currentProfileId } = get();
        return profiles.find((p) => p.id === currentProfileId) || null;
      },
    }),
    {
      name: 'family-game-profiles',
    }
  )
);
