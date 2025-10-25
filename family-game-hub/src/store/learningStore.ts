import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { allSentences } from '../data/sentences';

// 문장 학습 기록
interface SentenceLearning {
  learned: boolean;
  learnedAt?: number;
  bookmarked: boolean;
  reviewCount: number;
}

// 책 읽기 기록
interface BookReading {
  completed: boolean;
  completedAt?: number;
  currentPage: number;
  totalReads: number;
}

interface LearningState {
  // 문장 학습 기록
  sentencesLearned: Record<string, SentenceLearning>;

  // 책 읽기 기록
  booksRead: Record<string, BookReading>;

  // 문장 학습 액션
  markSentenceLearned: (sentenceText: string) => void;
  toggleBookmark: (sentenceText: string) => void;
  incrementReviewCount: (sentenceText: string) => void;

  // 책 읽기 액션
  updateBookProgress: (bookId: string, page: number) => void;
  markBookCompleted: (bookId: string) => void;

  // 통계
  getCategoryProgress: (category: string) => { total: number; learned: number; percentage: number };
  getBookProgress: (bookId: string) => BookReading;
  getTotalLearnedSentences: () => number;
  getTotalBooksRead: () => number;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      sentencesLearned: {},
      booksRead: {},

      markSentenceLearned: (sentenceText: string) => {
        set((state) => ({
          sentencesLearned: {
            ...state.sentencesLearned,
            [sentenceText]: {
              learned: true,
              learnedAt: Date.now(),
              bookmarked: state.sentencesLearned[sentenceText]?.bookmarked || false,
              reviewCount: (state.sentencesLearned[sentenceText]?.reviewCount || 0) + 1,
            },
          },
        }));
      },

      toggleBookmark: (sentenceText: string) => {
        set((state) => ({
          sentencesLearned: {
            ...state.sentencesLearned,
            [sentenceText]: {
              ...state.sentencesLearned[sentenceText],
              bookmarked: !state.sentencesLearned[sentenceText]?.bookmarked,
              learned: state.sentencesLearned[sentenceText]?.learned || false,
              reviewCount: state.sentencesLearned[sentenceText]?.reviewCount || 0,
            },
          },
        }));
      },

      incrementReviewCount: (sentenceText: string) => {
        set((state) => ({
          sentencesLearned: {
            ...state.sentencesLearned,
            [sentenceText]: {
              ...state.sentencesLearned[sentenceText],
              reviewCount: (state.sentencesLearned[sentenceText]?.reviewCount || 0) + 1,
              learned: state.sentencesLearned[sentenceText]?.learned || false,
              bookmarked: state.sentencesLearned[sentenceText]?.bookmarked || false,
            },
          },
        }));
      },

      updateBookProgress: (bookId: string, page: number) => {
        set((state) => ({
          booksRead: {
            ...state.booksRead,
            [bookId]: {
              ...state.booksRead[bookId],
              currentPage: page,
              completed: state.booksRead[bookId]?.completed || false,
              totalReads: state.booksRead[bookId]?.totalReads || 0,
            },
          },
        }));
      },

      markBookCompleted: (bookId: string) => {
        set((state) => ({
          booksRead: {
            ...state.booksRead,
            [bookId]: {
              completed: true,
              completedAt: Date.now(),
              currentPage: 0,
              totalReads: (state.booksRead[bookId]?.totalReads || 0) + 1,
            },
          },
        }));
      },

      getCategoryProgress: (category: string) => {
        const state = get();
        const categorySentences = allSentences.filter((s) => s.category === category);
        const total = categorySentences.length;
        const learned = categorySentences.filter(
          (s) => state.sentencesLearned[s.sentence]?.learned
        ).length;
        const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;

        return { total, learned, percentage };
      },

      getBookProgress: (bookId: string) => {
        const state = get();
        return (
          state.booksRead[bookId] || {
            completed: false,
            currentPage: 0,
            totalReads: 0,
          }
        );
      },

      getTotalLearnedSentences: () => {
        const state = get();
        return Object.values(state.sentencesLearned).filter((s) => s.learned).length;
      },

      getTotalBooksRead: () => {
        const state = get();
        return Object.values(state.booksRead).filter((b) => b.completed).length;
      },
    }),
    {
      name: 'learning-storage',
    }
  )
);
