import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GameRecord,
  GameStats,
  Difficulty,
  PlayHighlight,
  WeeklyHighlightSummary,
} from '../types';

interface GameState {
  records: GameRecord[];
  highlights: PlayHighlight[];
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
  getRecentHighlights: () => PlayHighlight[];
  getWeeklyHighlightSummary: () => WeeklyHighlightSummary | null;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      records: [],
      highlights: [],

      addRecord: (record) => {
        set((state) => ({
          records: [...state.records, record],
        }));
      },

      addHighlight: ({ id, createdAt, ...highlight }) => {
        const highlightId = id ?? crypto.randomUUID();
        const newHighlight: PlayHighlight = {
          ...highlight,
          id: highlightId,
          createdAt: createdAt ?? Date.now(),
          reactions: 0,
          shares: 0,
        };

        set((state) => ({
          highlights: [...state.highlights, newHighlight].sort(
            (a, b) => b.createdAt - a.createdAt
          ),
        }));

        return highlightId;
      },

      addHighlightReaction: (highlightId) => {
        set((state) => ({
          highlights: state.highlights.map((highlight) =>
            highlight.id === highlightId
              ? { ...highlight, reactions: highlight.reactions + 1 }
              : highlight
          ),
        }));
      },

      addHighlightShare: (highlightId) => {
        set((state) => ({
          highlights: state.highlights.map((highlight) =>
            highlight.id === highlightId
              ? { ...highlight, shares: highlight.shares + 1 }
              : highlight
          ),
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

      getRecentHighlights: () => {
        const { highlights } = get();
        return [...highlights].sort((a, b) => b.createdAt - a.createdAt);
      },

      getWeeklyHighlightSummary: () => {
        const { highlights } = get();
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const weeklyHighlights = highlights.filter(
          (highlight) => highlight.createdAt >= oneWeekAgo
        );

        if (weeklyHighlights.length === 0) return null;

        const topHighlight = weeklyHighlights.reduce((top, current) => {
          const topEngagement = top.reactions + top.shares;
          const currentEngagement = current.reactions + current.shares;

          if (currentEngagement === topEngagement) {
            return current.score > top.score ? current : top;
          }

          return currentEngagement > topEngagement ? current : top;
        }, weeklyHighlights[0]);

        return {
          highlight: topHighlight,
          totalReactions: topHighlight.reactions,
          totalShares: topHighlight.shares,
        };
      },
    }),
    {
      name: 'family-game-records',
    }
  )
);
