import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VoiceSettingsState {
  autoPlay: boolean;
  voiceSpeed: number;

  setAutoPlay: (enabled: boolean) => void;
  setVoiceSpeed: (speed: number) => void;
  toggleAutoPlay: () => void;
}

export const useVoiceSettingsStore = create<VoiceSettingsState>()(
  persist(
    (set) => ({
      autoPlay: true,
      voiceSpeed: 1.0,

      setAutoPlay: (enabled: boolean) => set({ autoPlay: enabled }),

      setVoiceSpeed: (speed: number) => set({ voiceSpeed: Math.max(0.5, Math.min(1.5, speed)) }),

      toggleAutoPlay: () => set((state) => ({ autoPlay: !state.autoPlay })),
    }),
    {
      name: 'voice-settings-storage',
    }
  )
);
