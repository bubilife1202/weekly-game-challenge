import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameRecord, GameStats, Difficulty, WeeklyChallenge } from '../types';

interface GameState {
  records: GameRecord[];
  weeklyChallenge: WeeklyChallenge;
  addRecord: (record: GameRecord) => void;
  getProfileStats: (profileId: string) => GameStats;
  getWeeklyRanking: () => { profileId: string; count: number }[];
  getWeeklyChallengeProgress: () => {
    count: number;
    target: number;
    isCompleted: boolean;
  };
  refreshWeeklyChallenge: () => void;
  claimWeeklyReward: () => void;
}

const getEndOfWeek = () => {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + daysUntilSunday);
  endOfWeek.setHours(23, 59, 59, 999);

  return endOfWeek.getTime();
};

const createDefaultWeeklyChallenge = (): WeeklyChallenge => {
  const deadline = getEndOfWeek();
  const deadlineDate = new Date(deadline);

  return {
    mission: '가족이 함께 3회 게임 플레이 달성',
    deadline,
    rewardStamp: `family-trophy-${deadlineDate.getFullYear()}-${deadlineDate.getMonth() + 1}-${deadlineDate.getDate()}`,
    targetPlays: 3,
    rewardClaimed: false,
  };
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      records: [],
      weeklyChallenge: createDefaultWeeklyChallenge(),

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

      refreshWeeklyChallenge: () => {
        const { weeklyChallenge } = get();
        if (!weeklyChallenge || weeklyChallenge.deadline < Date.now()) {
          set({ weeklyChallenge: createDefaultWeeklyChallenge() });
        }
      },

      getWeeklyChallengeProgress: () => {
        const { records, weeklyChallenge } = get();
        const challengeWindowStart =
          weeklyChallenge.deadline - 7 * 24 * 60 * 60 * 1000;

        const count = records.filter(
          (r) =>
            r.completedAt >= challengeWindowStart &&
            r.completedAt <= weeklyChallenge.deadline
        ).length;

        return {
          count,
          target: weeklyChallenge.targetPlays,
          isCompleted: count >= weeklyChallenge.targetPlays,
        };
      },

      claimWeeklyReward: () => {
        set((state) => ({
          weeklyChallenge: { ...state.weeklyChallenge, rewardClaimed: true },
        }));
      },
    }),
    {
      name: 'family-game-records',
    }
  )
);
