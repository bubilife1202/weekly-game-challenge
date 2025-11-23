import type { AgeGroup, Difficulty, GameCategory, GamePreference } from '../types';

export type GameRecommendation = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  path: string;
  categories: GameCategory[];
  suitableFor: AgeGroup[];
  difficulties: Difficulty[];
};

const games: GameRecommendation[] = [
  {
    id: 'memory',
    title: '카드 뒤집기',
    description: '같은 카드를 찾으며 기억력을 키워요',
    emoji: '🃏',
    path: '/game/memory',
    categories: ['puzzle', 'cooperative', 'strategy'],
    suitableFor: ['kids', 'family'],
    difficulties: ['easy', 'medium'],
  },
  {
    id: 'coloring',
    title: '색칠하기',
    description: '창의력을 자극하는 색칠 놀이',
    emoji: '🎨',
    path: '/game/coloring',
    categories: ['creativity'],
    suitableFor: ['kids', 'family'],
    difficulties: ['easy'],
  },
  {
    id: 'world-map',
    title: '세계 지도 퀴즈',
    description: '지도를 탐험하며 지리를 배워요',
    emoji: '🌍',
    path: '/game/world-map',
    categories: ['learning', 'strategy'],
    suitableFor: ['teens', 'family'],
    difficulties: ['medium'],
  },
  {
    id: 'english-words',
    title: '영어 단어 외우기',
    description: '단어 암기로 어휘력을 늘려요',
    emoji: '🔤',
    path: '/game/english-words',
    categories: ['learning'],
    suitableFor: ['kids', 'teens'],
    difficulties: ['easy', 'medium'],
  },
  {
    id: 'english-sentences',
    title: '영어 문장 만들기',
    description: '문장을 조합하며 영어 감각을 키워요',
    emoji: '📖',
    path: '/game/english-sentences',
    categories: ['learning', 'strategy'],
    suitableFor: ['teens', 'family'],
    difficulties: ['medium'],
  },
  {
    id: 'sudoku',
    title: '스도쿠',
    description: '논리 퍼즐로 두뇌를 단련해요',
    emoji: '🧩',
    path: '/game/sudoku',
    categories: ['puzzle', 'strategy'],
    suitableFor: ['teens', 'family'],
    difficulties: ['medium', 'hard'],
  },
  {
    id: 'maze',
    title: '미로 찾기',
    description: '길을 찾아 빠져나오는 모험',
    emoji: '🌟',
    path: '/game/maze',
    categories: ['puzzle', 'cooperative'],
    suitableFor: ['kids', 'family'],
    difficulties: ['easy', 'medium'],
  },
  {
    id: 'snake',
    title: '스네이크',
    description: '빠른 판단력으로 길게 성장하기',
    emoji: '🐍',
    path: '/game/snake',
    categories: ['arcade', 'competitive'],
    suitableFor: ['kids', 'teens'],
    difficulties: ['medium'],
  },
  {
    id: '2048',
    title: '2048',
    description: '숫자를 합쳐 목표를 달성해요',
    emoji: '🔢',
    path: '/game/2048',
    categories: ['strategy', 'puzzle'],
    suitableFor: ['teens', 'family'],
    difficulties: ['medium'],
  },
  {
    id: 'minesweeper',
    title: '지뢰찾기',
    description: '논리력으로 지뢰를 피해요',
    emoji: '💣',
    path: '/game/minesweeper',
    categories: ['strategy', 'puzzle'],
    suitableFor: ['teens', 'family'],
    difficulties: ['hard'],
  },
  {
    id: 'galaga',
    title: '갤러그',
    description: '슈팅으로 최고 점수에 도전',
    emoji: '🚀',
    path: '/game/galaga',
    categories: ['arcade', 'competitive', 'action'],
    suitableFor: ['teens', 'family'],
    difficulties: ['medium', 'hard'],
  },
  {
    id: 'breakout',
    title: '벽돌깨기',
    description: '리듬감 있게 벽돌을 깨요',
    emoji: '🧱',
    path: '/game/breakout',
    categories: ['arcade', 'competitive'],
    suitableFor: ['kids', 'teens', 'family'],
    difficulties: ['easy', 'medium'],
  },
  {
    id: 'mario',
    title: '슈퍼 점프맨',
    description: '점프와 모험이 가득한 액션',
    emoji: '🍄',
    path: '/game/mario',
    categories: ['action', 'arcade'],
    suitableFor: ['kids', 'teens'],
    difficulties: ['medium'],
  },
  {
    id: 'wind-legacy',
    title: '바람의 유산',
    description: '시간을 되감는 퍼즐 어드벤처',
    emoji: '🌪️',
    path: '/game/wind-legacy',
    categories: ['puzzle', 'strategy', 'action'],
    suitableFor: ['teens', 'family'],
    difficulties: ['hard'],
  },
];

const scoreByMatch = (
  preference: GamePreference,
  game: GameRecommendation
): number => {
  let score = 0;

  const typeMatches = game.categories.filter((category) =>
    preference.favoriteTypes.includes(category)
  ).length;
  score += typeMatches * 2;

  if (game.difficulties.includes(preference.preferredDifficulty)) {
    score += 2;
  }

  if (game.suitableFor.includes(preference.ageGroup)) {
    score += 2;
  }

  return score;
};

export const getRecommendationsFromPreferences = (
  preference?: GamePreference,
  limit = 3
): GameRecommendation[] => {
  if (!preference) return [];

  return games
    .map((game) => ({
      ...game,
      score: scoreByMatch(preference, game),
    }))
    .filter((game) => game.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score, ...game }) => game);
};
