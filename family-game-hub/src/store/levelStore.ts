import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 배지 타입
export type Badge = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt?: number;
};

// 레벨 시스템 상태
interface LevelState {
  // 레벨 정보
  currentLevel: number;
  currentXP: number;
  totalXP: number;

  // 연속 기록
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  consecutiveDays: number;

  // 진행률
  totalSentencesCompleted: number;
  sentencesByCategory: Record<string, number>;

  // 배지/업적
  badges: Badge[];

  // 일일 목표
  dailyGoal: number;
  dailyProgress: number;
  lastDailyReset: string;

  // 액션
  addXP: (xp: number, sentenceCategory: string) => void;
  checkLevelUp: () => boolean;
  updateStreak: (correct: boolean) => void;
  checkDailyProgress: () => void;
  unlockBadge: (badge: Badge) => void;
  checkBadges: (totalCompleted: number) => void;
  resetDaily: () => void;
  getUnlockedSentences: () => number;
}

// 레벨별 필요 XP
const XP_PER_LEVEL = [
  0,     // 레벨 1
  100,   // 레벨 2
  250,   // 레벨 3
  450,   // 레벨 4
  700,   // 레벨 5
  1000,  // 레벨 6
  1400,  // 레벨 7
  1900,  // 레벨 8
  2500,  // 레벨 9
  3200,  // 레벨 10
];

// 레벨별 해금되는 문장 수
const SENTENCES_PER_LEVEL = [
  20,   // 레벨 1: 20개
  40,   // 레벨 2: 40개
  60,   // 레벨 3: 60개
  80,   // 레벨 4: 80개
  100,  // 레벨 5: 100개
  120,  // 레벨 6: 120개
  140,  // 레벨 7: 140개
  160,  // 레벨 8: 160개
  180,  // 레벨 9: 180개
  999,  // 레벨 10: 전체
];

// 배지 목록
const ALL_BADGES: Badge[] = [
  { id: 'perfect', name: '완벽주의자', description: '100% 정답으로 게임 완료', emoji: '💯' },
  { id: 'streak_5', name: '연속왕', description: '5연속 정답', emoji: '🔥' },
  { id: 'streak_10', name: '연속 마스터', description: '10연속 정답', emoji: '⚡' },
  { id: 'speed', name: '스피드러너', description: '30초 안에 10문제 클리어', emoji: '⏱️' },
  { id: 'daily_3', name: '꾸준이', description: '3일 연속 플레이', emoji: '📅' },
  { id: 'daily_7', name: '일주일의 전설', description: '7일 연속 플레이', emoji: '🌟' },
  { id: 'category_master', name: '카테고리 마스터', description: '한 카테고리 100% 완료', emoji: '🏆' },
  { id: 'level_5', name: '중급자', description: '레벨 5 달성', emoji: '🎖️' },
  { id: 'level_10', name: '전설', description: '레벨 10 달성', emoji: '👑' },
  { id: 'sentence_50', name: '탐험가', description: '50개 문장 완료', emoji: '🗺️' },
  { id: 'sentence_100', name: '수집가', description: '100개 문장 완료', emoji: '📚' },
  { id: 'sentence_150', name: '언어 마스터', description: '150개 문장 완료', emoji: '🎓' },
];

const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export const useLevelStore = create<LevelState>()(
  persist(
    (set, get) => ({
      currentLevel: 1,
      currentXP: 0,
      totalXP: 0,
      currentStreak: 0,
      maxStreak: 0,
      lastPlayedDate: null,
      consecutiveDays: 0,
      totalSentencesCompleted: 0,
      sentencesByCategory: {},
      badges: [],
      dailyGoal: 10,
      dailyProgress: 0,
      lastDailyReset: getTodayString(),

      addXP: (xp: number, sentenceCategory: string) => {
        const state = get();
        const newTotalXP = state.totalXP + xp;
        const newCurrentXP = state.currentXP + xp;

        // 문장 완료 카운트
        const newSentencesByCategory = { ...state.sentencesByCategory };
        newSentencesByCategory[sentenceCategory] = (newSentencesByCategory[sentenceCategory] || 0) + 1;

        const newTotalCompleted = state.totalSentencesCompleted + 1;

        set({
          currentXP: newCurrentXP,
          totalXP: newTotalXP,
          totalSentencesCompleted: newTotalCompleted,
          sentencesByCategory: newSentencesByCategory,
          dailyProgress: state.dailyProgress + 1,
        });

        // 배지 체크
        get().checkBadges(newTotalCompleted);
      },

      checkLevelUp: () => {
        const state = get();
        const currentLevelIndex = state.currentLevel - 1;

        if (currentLevelIndex >= XP_PER_LEVEL.length - 1) {
          return false; // 최대 레벨
        }

        const xpNeeded = XP_PER_LEVEL[currentLevelIndex + 1];

        if (state.totalXP >= xpNeeded) {
          set({
            currentLevel: state.currentLevel + 1,
            currentXP: 0,
          });

          // 레벨 배지 체크
          if (state.currentLevel + 1 === 5) {
            get().unlockBadge(ALL_BADGES.find(b => b.id === 'level_5')!);
          }
          if (state.currentLevel + 1 === 10) {
            get().unlockBadge(ALL_BADGES.find(b => b.id === 'level_10')!);
          }

          return true;
        }

        return false;
      },

      updateStreak: (correct: boolean) => {
        const state = get();

        if (correct) {
          const newStreak = state.currentStreak + 1;
          const newMaxStreak = Math.max(state.maxStreak, newStreak);

          set({
            currentStreak: newStreak,
            maxStreak: newMaxStreak,
          });

          // 스트릭 배지 체크
          if (newStreak === 5) {
            get().unlockBadge(ALL_BADGES.find(b => b.id === 'streak_5')!);
          }
          if (newStreak === 10) {
            get().unlockBadge(ALL_BADGES.find(b => b.id === 'streak_10')!);
          }
        } else {
          set({ currentStreak: 0 });
        }
      },

      checkDailyProgress: () => {
        const state = get();
        const today = getTodayString();
        const lastPlayed = state.lastPlayedDate;

        if (lastPlayed !== today) {
          // 연속 출석 체크
          if (lastPlayed) {
            const lastDate = new Date(lastPlayed);
            const todayDate = new Date(today);
            const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              // 연속
              const newConsecutiveDays = state.consecutiveDays + 1;
              set({ consecutiveDays: newConsecutiveDays });

              // 연속 출석 배지
              if (newConsecutiveDays === 3) {
                get().unlockBadge(ALL_BADGES.find(b => b.id === 'daily_3')!);
              }
              if (newConsecutiveDays === 7) {
                get().unlockBadge(ALL_BADGES.find(b => b.id === 'daily_7')!);
              }
            } else {
              // 연속 끊김
              set({ consecutiveDays: 1 });
            }
          } else {
            set({ consecutiveDays: 1 });
          }

          set({ lastPlayedDate: today });
        }

        // 일일 목표 리셋 체크
        if (state.lastDailyReset !== today) {
          get().resetDaily();
        }
      },

      unlockBadge: (badge: Badge) => {
        const state = get();
        if (!state.badges.find(b => b.id === badge.id)) {
          set({
            badges: [...state.badges, { ...badge, unlockedAt: Date.now() }],
          });
        }
      },

      checkBadges: (totalCompleted: number) => {
        // 문장 개수 배지
        if (totalCompleted === 50) {
          get().unlockBadge(ALL_BADGES.find(b => b.id === 'sentence_50')!);
        }
        if (totalCompleted === 100) {
          get().unlockBadge(ALL_BADGES.find(b => b.id === 'sentence_100')!);
        }
        if (totalCompleted === 150) {
          get().unlockBadge(ALL_BADGES.find(b => b.id === 'sentence_150')!);
        }
      },

      resetDaily: () => {
        set({
          dailyProgress: 0,
          lastDailyReset: getTodayString(),
        });
      },

      getUnlockedSentences: () => {
        const state = get();
        const levelIndex = state.currentLevel - 1;
        return SENTENCES_PER_LEVEL[levelIndex] || 20;
      },
    }),
    {
      name: 'level-storage',
    }
  )
);

// 헬퍼 함수들
export const getXPForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= XP_PER_LEVEL.length) return 0;
  return XP_PER_LEVEL[currentLevel];
};

export const getXPProgress = (currentXP: number, currentLevel: number): number => {
  const xpNeeded = getXPForNextLevel(currentLevel);
  if (xpNeeded === 0) return 100;
  return Math.min(100, Math.round((currentXP / xpNeeded) * 100));
};

export const getLevelName = (level: number): string => {
  const names = [
    '초보자', // 1
    '학습자', // 2
    '탐험가', // 3
    '숙련자', // 4
    '중급자', // 5
    '고급자', // 6
    '전문가', // 7
    '달인', // 8
    '마스터', // 9
    '전설', // 10
  ];
  return names[level - 1] || '전설';
};
