import type { ReactNode } from 'react';
import type { Difficulty } from '../../types';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  badgeLabel?: string;
  difficulty?: Difficulty | 'family';
  playTime?: string;
}

const difficultyTone: Record<NonNullable<CardProps['difficulty']>, string> = {
  easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  hard: 'bg-rose-100 text-rose-700 border-rose-200',
  family: 'bg-sky-100 text-sky-700 border-sky-200',
};

export const Card = ({
  children,
  className = '',
  onClick,
  badgeLabel,
  difficulty,
  playTime,
}: CardProps) => {
  const baseClasses =
    'relative bg-white rounded-2xl shadow-lg p-6 transition-all duration-200';
  const clickableClasses = onClick
    ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 active:scale-95'
    : '';

  const difficultyLabel =
    difficulty === 'family'
      ? '패밀리'
      : difficulty === 'easy'
        ? '쉬움'
        : difficulty === 'medium'
          ? '보통'
          : '어려움';

  return (
    <div
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {(badgeLabel || difficulty || playTime) && (
        <div className="absolute top-4 right-4 flex items-center gap-2 flex-wrap justify-end">
          {badgeLabel && (
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wide bg-primary/10 text-primary rounded-full border border-primary/20 shadow-sm">
              {badgeLabel}
            </span>
          )}
          {difficulty && (
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${difficultyTone[difficulty]}`}
            >
              난이도 {difficultyLabel}
            </span>
          )}
          {playTime && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full border bg-slate-100 text-slate-700 border-slate-200">
              ⏱ {playTime}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
