import { useEffect, useState } from 'react';

type Particle = {
  id: number;
  emoji: string;
  left: number;
  animationDelay: number;
  animationDuration: number;
  size: number;
};

export const Confetti = ({ show }: { show: boolean }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const emojis = ['⭐', '✨', '🌟', '💫', '⭐', '✨', '🎉', '🎊', '💝', '❤️'];
      const newParticles: Particle[] = [];

      for (let i = 0; i < 15; i++) {
        newParticles.push({
          id: i,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          left: Math.random() * 100,
          animationDelay: Math.random() * 0.5,
          animationDuration: 2 + Math.random() * 1,
          size: 20 + Math.random() * 20,
        });
      }

      setParticles(newParticles);

      // 3초 후 파티클 제거
      const timeout = setTimeout(() => {
        setParticles([]);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [show]);

  if (!show || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-fall"
          style={{
            left: `${particle.left}%`,
            top: '-50px',
            fontSize: `${particle.size}px`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
};
