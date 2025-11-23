import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
  targetFps: number;
  lowPerformanceMode: boolean;
  toggleSound: () => void;
  toggleMusic: () => void;
  setVolume: (volume: number) => void;
  setTargetFps: (fps: number) => void;
  toggleLowPerformanceMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      musicEnabled: true,
      volume: 0.7,
      targetFps: 60,
      lowPerformanceMode: false,

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },

      toggleMusic: () => {
        set((state) => ({ musicEnabled: !state.musicEnabled }));
      },

      setVolume: (volume) => {
        set({ volume: Math.max(0, Math.min(1, volume)) });
      },

      setTargetFps: (fps) => {
        const clampedFps = Math.min(120, Math.max(30, Math.round(fps)));
        set({ targetFps: clampedFps });
      },

      toggleLowPerformanceMode: () => {
        set((state) => ({ lowPerformanceMode: !state.lowPerformanceMode }));
      },
    }),
    {
      name: 'family-game-settings',
    }
  )
);
