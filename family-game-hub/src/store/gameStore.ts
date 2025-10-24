import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameRecord, GameStats, Difficulty } from '../types';

interface GameState {
  records: GameRecord[];
  addRecord: (record: GameRecord) => void;
  getProfileStats: (profileId: string) => GameStats;
  getWeeklyRanking: () => { profileId: string; count: number }[];
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (record) => {
        set((state) => ({
          records: [...state.records, record],
        }));
      },

      getProfileStats: (profileId) => {
        const { records } = get();
        const profileRecords = records.filter((r) => r.profileId === profileId);

        const bestRecords: { [key in Difficulty]?: GameRecord } = {};

        (['easy', 'medium', 'hard'] as Difficulty[]).forEach((difficulty) => {
          const difficultyRecords = profileRecords.filter(
            (r) => r.difficulty === difficulty
          );
          if (difficultyRecords.length > 0) {
            bestRecords[difficulty] = difficultyRecords.reduce((best, current) =>
              current.time < best.time ? current : best
            );
          }
        });

        return {
          totalGames: profileRecords.length,
          totalTime: profileRecords.reduce((sum, r) => sum + r.time, 0),
          bestRecords,
          recentGames: profileRecords.slice(-10).reverse(),
        };
      },

      getWeeklyRanking: () => {
        const { records } = get();
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const weeklyRecords = records.filter((r) => r.completedAt > oneWeekAgo);

        const countByProfile = weeklyRecords.reduce((acc, record) => {
          acc[record.profileId] = (acc[record.profileId] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return Object.entries(countByProfile)
          .map(([profileId, count]) => ({ profileId, count }))
          .sort((a, b) => b.count - a.count);
      },
    }),
    {
      name: 'family-game-records',
    }
  )
);
