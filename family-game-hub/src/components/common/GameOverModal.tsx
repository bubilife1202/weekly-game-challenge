import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';
import { AdSense } from './AdSense';
import { useEffect, useState } from 'react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  bestScore?: number;
  gameName: string;
  onRestart: () => void;
  onHome: () => void;
  additionalInfo?: React.ReactNode;
}

export const GameOverModal = ({
  isOpen,
  score,
  bestScore,
  gameName,
  onRestart,
  onHome,
  additionalInfo,
}: GameOverModalProps) => {
  const [showAdButton, setShowAdButton] = useState(false);

  useEffect(() => {
    // 50% 확률로 "광고 보고 부활" 버튼 노출 (실험적 기능)
    if (Math.random() > 0.5) setShowAdButton(true);
  }, [isOpen]);

  const handleShare = async () => {
    const text = `[${gameName}] 제 점수는 ${score}점입니다! 당신도 도전해보세요! #FamilyGameHub`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Family Game Hub - 신기록 달성!',
          text: text,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: 클립보드 복사
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      alert('점수와 링크가 복사되었습니다! 카톡에 붙여넣어 보세요.');
    }
  };

  const handleWatchAd = () => {
    // 실제 광고 연동 로직이 들어갈 곳 (현재는 목업)
    const confirm = window.confirm("광고를 다 시청하시겠습니까? (테스트)");
    if (confirm) {
        alert("부활 기능은 아직 개발 중입니다! 대신 보너스 점수 100점을 드릴게요. (마음으로)");
        onRestart();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* 헤더 */}
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl mb-2"
            >
              💀
            </motion.div>
            <h2 className="text-3xl font-black uppercase tracking-wider drop-shadow-md">Game Over</h2>
          </div>

          {/* 컨텐츠 */}
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="text-gray-500 text-sm font-medium">YOUR SCORE</div>
              <div className="text-5xl font-black text-gray-800 tracking-tight font-mono">
                {score.toLocaleString()}
              </div>
              {bestScore !== undefined && (
                 <div className="text-sm text-orange-600 font-bold bg-orange-100 inline-block px-3 py-1 rounded-full">
                   🏆 BEST: {bestScore.toLocaleString()}
                 </div>
              )}
            </div>

            {additionalInfo && (
              <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-600 text-sm border border-gray-100">
                {additionalInfo}
              </div>
            )}

            {/* 버튼 그룹 */}
            <div className="space-y-3">
              {showAdButton && (
                  <button
                    onClick={handleWatchAd}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <span>📺</span> 광고 보고 이어하기 (Beta)
                  </button>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button variant="primary" onClick={onRestart} fullWidth animated className="h-14 text-lg">
                  🔄 다시 하기
                </Button>
                <Button variant="secondary" onClick={handleShare} fullWidth animated className="h-14 text-lg bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-yellow-500">
                  📣 자랑하기
                </Button>
              </div>

              <button
                onClick={onHome}
                className="w-full text-gray-400 hover:text-gray-600 text-sm font-medium py-2"
              >
                메인으로 돌아가기
              </button>
            </div>

            {/* 하단 광고 영역 */}
            <div className="pt-2 border-t border-gray-100">
               <div className="text-xs text-center text-gray-400 mb-2">SPONSORED</div>
               <div className="min-h-[100px] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                 <AdSense />
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
