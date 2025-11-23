// 프로필 타입
export interface Profile {
  id: string;
  name: string;
  emoji: string;
  age?: number;
  color: string;
  createdAt: number;
}

// 게임 난이도
export type Difficulty = 'easy' | 'medium' | 'hard';

// 카드 타입
export interface Card {
  id: string;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// 게임 기록
export interface GameRecord {
  profileId: string;
  gameType: 'memory' | 'sudoku' | 'maze' | 'snake' | '2048' | 'minesweeper' | 'galaga' | 'breakout';
  difficulty: Difficulty;
  score: number;
  time: number; // 초 단위
  attempts?: number;
  accuracy?: number; // 퍼센트
  completedAt: number;
}

// 게임 통계
export interface GameStats {
  totalGames: number;
  totalTime: number;
  bestRecords: {
    [key in Difficulty]?: GameRecord;
  };
  recentGames: GameRecord[];
}

// 미션
export type MissionType = 'daily' | 'weekly';

export interface MissionReward {
  skin: string;
  effectSound: string;
  badge: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: MissionType;
  target: number;
  progress: number;
  completed: boolean;
  reward: MissionReward;
  resetKey: string;
}

// 리그 티어
export type LeagueTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface LeagueBadge {
  monthKey: string;
  tier: LeagueTier;
  awardedAt: number;
}

export interface LeagueState {
  monthKey: string;
  points: number;
  tier: LeagueTier;
  lastBadge?: LeagueBadge;
  badgeHistory: LeagueBadge[];
}

// 카드 테마
export type CardTheme = 'animals' | 'fruits' | 'emojis' | 'vehicles';

export interface CardThemeData {
  name: string;
  emoji: string;
  cards: string[];
}
