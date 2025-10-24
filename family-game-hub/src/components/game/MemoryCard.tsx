import type { Card as CardType } from '../../types';
import { motion } from 'framer-motion';

interface MemoryCardProps {
  card: CardType;
  onClick: () => void;
  disabled: boolean;
}

export const MemoryCard = ({ card, onClick, disabled }: MemoryCardProps) => {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick();
    }
  };

  return (
    <motion.div
      className="relative w-full aspect-square cursor-pointer"
      onClick={handleClick}
      whileTap={!disabled && !card.isFlipped && !card.isMatched ? { scale: 0.95 } : {}}
      animate={{
        rotateY: card.isFlipped || card.isMatched ? 180 : 0,
        scale: card.isMatched ? 0 : 1,
      }}
      transition={{
        duration: 0.3,
        type: 'spring',
        stiffness: 200,
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* 뒷면 */}
      <div
        className={`absolute inset-0 rounded-xl flex items-center justify-center text-4xl md:text-5xl font-bold ${
          card.isMatched ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <span className="text-white">?</span>
      </div>

      {/* 앞면 */}
      <div
        className={`absolute inset-0 bg-white rounded-xl flex items-center justify-center text-4xl md:text-6xl shadow-lg ${
          card.isMatched ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <span>{card.value}</span>
      </div>
    </motion.div>
  );
};
