import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameRecord, GameStats, Difficulty } from '../types';

interface GameState {
  records: GameRecord[];
  playStreaks: Record<string, { count: number; lastPlayed: number }>;
  bonusSkins: Record<string, string[]>;
  latestBonus?: {
    profileId: string;
    streakCount: number;
    bonusScore?: number;
    bonusSkin?: string;
  };
  addRecord: (record: GameRecord) => void;
  getProfileStats: (profileId: string) => GameStats;
  getWeeklyRanking: () => { profileId: string; count: number }[];
  getBonusStatus: (profileId: string) => {
    streakCount: number;
    nextUnlockIn: number;
    unlockedSkins: string[];
    latestBonus?: GameState['latestBonus'];
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      records: [],
      playStreaks: {},
      bonusSkins: {},

      addRecord: (record) => {
        const now = Date.now();

        set((state) => {
          const streakInfo = state.playStreaks[record.profileId] || {
            count: 0,
            lastPlayed: 0,
          };

          const withinSession = now - streakInfo.lastPlayed < 45 * 60 * 1000;
          const streakCount = withinSession ? streakInfo.count + 1 : 1;
          const earnedBonus = streakCount > 0 && streakCount % 3 === 0;

          const bonusScore = earnedBonus
            ? Math.max(25, Math.round(record.score * 0.15))
            : undefined;
          const bonusSkin = earnedBonus
            ? `${record.gameType}-streak-${Math.floor(streakCount / 3)}`
            : undefined;

          const enrichedRecord: GameRecord = {
            ...record,
            streakCount,
            ...(bonusScore ? { bonusScore } : {}),
            ...(bonusSkin ? { bonusSkin } : {}),
          };

          const unlockedSkins = bonusSkin
            ? [...(state.bonusSkins[record.profileId] || []), bonusSkin]
            : state.bonusSkins[record.profileId] || [];

          const latestBonus = {
            profileId: record.profileId,
            streakCount,
            bonusScore,
            bonusSkin,
          };

          return {
            records: [...state.records, enrichedRecord],
            playStreaks: {
              ...state.playStreaks,
              [record.profileId]: { count: streakCount, lastPlayed: now },
            },
            bonusSkins: {
              ...state.bonusSkins,
              [record.profileId]: unlockedSkins,
            },
            latestBonus,
          };
        });
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

      getBonusStatus: (profileId) => {
        const { playStreaks, bonusSkins, latestBonus } = get();
        const streakCount = playStreaks[profileId]?.count ?? 0;
        const nextUnlockIn = 3 - ((streakCount % 3) || 3);

        return {
          streakCount,
          nextUnlockIn,
          unlockedSkins: bonusSkins[profileId] || [],
          latestBonus,
        };
      },
    }),
    {
      name: 'family-game-records',
    }
  )
);
