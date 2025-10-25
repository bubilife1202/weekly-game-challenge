import { useEffect, useState } from 'react';

type CharacterState = 'idle' | 'happy' | 'sad' | 'thinking';

interface CharacterProps {
  state: CharacterState;
  size?: 'small' | 'medium' | 'large';
}

const characterExpressions = {
  idle: { emoji: '🐻', message: '문제를 풀어보세요!' },
  happy: { emoji: '🎉', message: '정답이에요! 멋져요!' },
  sad: { emoji: '😅', message: '아쉬워요! 다시 해봐요!' },
  thinking: { emoji: '🤔', message: '음... 뭐가 정답일까?' },
};

export const Character = ({ state, size = 'medium' }: CharacterProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentState, setCurrentState] = useState<CharacterState>(state);

  const sizeClasses = {
    small: 'text-6xl',
    medium: 'text-8xl',
    large: 'text-9xl',
  };

  useEffect(() => {
    if (state !== currentState) {
      setIsAnimating(true);
      setCurrentState(state);

      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [state, currentState]);

  const expression = characterExpressions[currentState];

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`
          ${sizeClasses[size]}
          transition-all duration-300
          ${isAnimating ? 'scale-125 rotate-6' : 'scale-100 rotate-0'}
          ${currentState === 'happy' ? 'animate-bounce' : ''}
          ${currentState === 'sad' ? 'animate-pulse' : ''}
        `}
        style={{
          fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif',
        }}
      >
        {expression.emoji}
      </div>
      <div
        className={`
          text-lg font-bold text-center
          transition-all duration-300
          ${currentState === 'happy' ? 'text-success' : ''}
          ${currentState === 'sad' ? 'text-primary' : ''}
          ${currentState === 'thinking' ? 'text-secondary' : 'text-textDark'}
        `}
      >
        {expression.message}
      </div>
    </div>
  );
};
