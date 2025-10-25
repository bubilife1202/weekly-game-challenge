import { useEffect, useState } from 'react';

interface LevelUpAnimationProps {
  show: boolean;
  newLevel: number;
  unlockedSentences: number;
  onComplete: () => void;
}

export const LevelUpAnimation = ({ show, newLevel, unlockedSentences, onComplete }: LevelUpAnimationProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);

      // 5초 후 자동으로 닫기
      const timeout = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fade-in">
      {/* 폭죽 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-firework"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {['🎉', '✨', '🌟', '💫', '⭐'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 text-center space-y-6 animate-scale-up">
        <div className="text-9xl animate-bounce">🏆</div>

        <div className="space-y-4">
          <h1 className="text-7xl font-black text-white animate-pulse">
            LEVEL UP!
          </h1>

          <div className="text-6xl font-bold text-yellow-400 animate-bounce">
            레벨 {newLevel}
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mx-4">
            <p className="text-2xl text-white font-bold mb-2">
              🎊 축하합니다! 🎊
            </p>
            <p className="text-xl text-yellow-300">
              {unlockedSentences}개의 새로운 문장이 해금되었어요!
            </p>
          </div>

          <div className="text-lg text-white/80">
            계속 열심히 공부해요! 💪
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes firework {
          0% {
            transform: translateY(0) scale(0);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) scale(1);
            opacity: 0;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-up {
          animation: scale-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .animate-firework {
          animation: firework 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
