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
  gameType: 'memory' | 'sudoku' | 'maze';
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

// 카드 테마
export type CardTheme = 'animals' | 'fruits' | 'emojis' | 'vehicles';

export interface CardThemeData {
  name: string;
  emoji: string;
  cards: string[];
}
