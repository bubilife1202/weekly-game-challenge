import type { Card, CardTheme, CardThemeData } from '../types';

// 카드 테마 데이터
export const cardThemes: Record<CardTheme, CardThemeData> = {
  animals: {
    name: '동물',
    emoji: '🐶',
    cards: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  },
  fruits: {
    name: '과일',
    emoji: '🍎',
    cards: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍑', '🍒', '🥝', '🍍', '🥥'],
  },
  emojis: {
    name: '이모지',
    emoji: '⭐',
    cards: ['⭐', '🌟', '💫', '✨', '🌈', '☀️', '🌙', '⚡', '🔥', '💎', '🎨', '🎵'],
  },
  vehicles: {
    name: '탈것',
    emoji: '🚗',
    cards: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛'],
  },
};

// 카드 섞기
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 게임 카드 생성
export const generateCards = (
  pairCount: number,
  theme: CardTheme = 'animals'
): Card[] => {
  const themeCards = cardThemes[theme].cards;
  const selectedCards = themeCards.slice(0, pairCount);
  const pairedCards = [...selectedCards, ...selectedCards];
  const shuffledCards = shuffleArray(pairedCards);

  return shuffledCards.map((value, index) => ({
    id: `card-${index}`,
    value,
    isFlipped: false,
    isMatched: false,
  }));
};

// 시간 포맷 (초 -> 분:초)
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 정확도 계산
export const calculateAccuracy = (matches: number, attempts: number): number => {
  if (attempts === 0) return 0;
  return Math.round((matches / attempts) * 100);
};

// 날짜 포맷
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInMs / (1000 * 60));
    return `${minutes}분 전`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours}시간 전`;
  } else if (diffInHours < 48) {
    return '어제';
  } else {
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
    });
  }
};

// 난이도별 설정
export const difficultyConfig = {
  easy: { pairs: 6, rows: 3, cols: 4, name: '쉬움' },
  medium: { pairs: 8, rows: 4, cols: 4, name: '보통' },
  hard: { pairs: 12, rows: 4, cols: 6, name: '어려움' },
};
