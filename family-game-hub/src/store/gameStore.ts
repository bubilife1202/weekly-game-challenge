import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameRecord,
  GameStats,
  Difficulty,
  Mission,
  MissionType,
  LeagueState,
} from '../types';

const getDateKey = (date = new Date()) => date.toISOString().split('T')[0];

const getWeekKey = (date = new Date()) => {
  const currentDate = new Date(date);
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(currentDate.setDate(diff));
  return monday.toISOString().split('T')[0];
};

const getMonthKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const missionRewards = {
  daily: {
    skin: '네온 스타 스킨',
    effectSound: '하이파이브 효과음',
    badge: '데일리 불꽃 배지',
  },
  weekly: {
    skin: '스프라이트 히어로 스킨',
    effectSound: '퍼레이드 효과음',
    badge: '주간 리더 배지',
  },
};

const createMission = (type: MissionType, resetKey: string): Mission => ({
  id: `${type}-${resetKey}`,
  title: type === 'daily' ? '오늘의 패스' : '주간 패스',
  description:
    type === 'daily'
      ? '하루에 3회 게임을 완료해요'
      : '일주일 동안 12회 게임을 완료해요',
  type,
  target: type === 'daily' ? 3 : 12,
  progress: 0,
  completed: false,
  reward: missionRewards[type],
  resetKey,
});

const calculateTier = (points: number): LeagueState['tier'] => {
  if (points >= 800) return 'diamond';
  if (points >= 550) return 'platinum';
  if (points >= 350) return 'gold';
  if (points >= 180) return 'silver';
  return 'bronze';
};

const calculateLeaguePoints = (record: GameRecord) => {
  const baseScore = Math.max(5, Math.round(record.score / 5));
  const speedBonus = Math.max(0, Math.round(Math.max(0, 300 - record.time) / 30));
  const difficultyBonus =
    record.difficulty === 'hard'
      ? 20
      : record.difficulty === 'medium'
        ? 12
        : 6;

  return baseScore + speedBonus + difficultyBonus;
};

const applyProgressWindowResets = (state: GameState) => {
  const updates: Partial<GameState> = {};

  const todayKey = getDateKey();
  const currentWeekKey = getWeekKey();
  const currentMonthKey = getMonthKey();

  if (state.dailyMission.resetKey !== todayKey) {
    updates.dailyMission = createMission('daily', todayKey);
  }

  if (state.weeklyMission.resetKey !== currentWeekKey) {
    updates.weeklyMission = createMission('weekly', currentWeekKey);
  }

  if (state.league.monthKey !== currentMonthKey) {
    const finalTier = calculateTier(state.league.points);
    const badge =
      state.league.points > 0
        ? {
            monthKey: state.league.monthKey,
            tier: finalTier,
            awardedAt: Date.now(),
          }
        : undefined;

    updates.league = {
      monthKey: currentMonthKey,
      points: 0,
      tier: 'bronze',
      lastBadge: badge || state.league.lastBadge,
      badgeHistory: badge
        ? [...state.league.badgeHistory, badge]
        : state.league.badgeHistory,
    };
  }

  return { normalizedState: { ...state, ...updates }, updates };
};

const incrementMissionProgress = (mission: Mission): Mission => {
  const nextProgress = Math.min(mission.target, mission.progress + 1);
  return {
    ...mission,
    progress: nextProgress,
    completed: nextProgress >= mission.target,
  };
};

interface GameState {
  records: GameRecord[];
  dailyMission: Mission;
  weeklyMission: Mission;
  league: LeagueState;
  addRecord: (record: GameRecord) => void;
  addHighlight: (
    highlight: Omit<
      PlayHighlight,
      'id' | 'createdAt' | 'reactions' | 'shares'
    > & { id?: string; createdAt?: number }
  ) => string;
  addHighlightReaction: (highlightId: string) => void;
  addHighlightShare: (highlightId: string) => void;
  getProfileStats: (profileId: string) => GameStats;
  getWeeklyRanking: () => { profileId: string; count: number }[];
  refreshProgress: () => void;
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
      dailyMission: createMission('daily', getDateKey()),
      weeklyMission: createMission('weekly', getWeekKey()),
      league: {
        monthKey: getMonthKey(),
        points: 0,
        tier: 'bronze',
        badgeHistory: [],
      },

      addRecord: (record) => {
        set((state) => {
          const { normalizedState, updates } = applyProgressWindowResets(state);

          const updatedRecords = [...normalizedState.records, record];
          const dailyMission = incrementMissionProgress(
            normalizedState.dailyMission
          );
          const weeklyMission = incrementMissionProgress(
            normalizedState.weeklyMission
          );

          const pointsEarned = calculateLeaguePoints(record);
          const newPoints = normalizedState.league.points + pointsEarned;
          const league = {
            ...normalizedState.league,
            points: newPoints,
            tier: calculateTier(newPoints),
          };

          return {
            ...updates,
            records: updatedRecords,
            dailyMission,
            weeklyMission,
            league,
          };
        });
      },

      getProfileStats: (profileId) => {
        const { normalizedState, updates } = applyProgressWindowResets(get());
        if (Object.keys(updates).length) {
          set(updates);
        }

        const profileRecords = normalizedState.records.filter(
          (r) => r.profileId === profileId
        );

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
        const { normalizedState, updates } = applyProgressWindowResets(get());
        if (Object.keys(updates).length) {
          set(updates);
        }

        const { records } = normalizedState;
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

      refreshProgress: () => {
        set((state) => applyProgressWindowResets(state).updates);
      },
    }),
    {
      name: 'family-game-records',
    }
  )
);
