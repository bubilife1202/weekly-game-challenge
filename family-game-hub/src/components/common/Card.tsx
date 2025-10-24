import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => {
  const baseClasses =
    'bg-white rounded-2xl shadow-lg p-6 transition-all duration-200';
  const clickableClasses = onClick
    ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 active:scale-95'
    : '';

  return (
    <div
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
