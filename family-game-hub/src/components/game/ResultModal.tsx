import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../common/Button';
import { formatTime } from '../../utils/helpers';
import type { Mission } from '../../types';

interface ResultModalProps {
  isOpen: boolean;
  time: number;
  attempts: number;
  accuracy: number;
  isNewRecord: boolean;
  missions: Mission[];
  onPlayAgain: () => void;
  onGoHome: () => void;
  onShare?: () => void;
}

export const ResultModal = ({
  isOpen,
  time,
  attempts,
  accuracy,
  isNewRecord,
  missions,
  onPlayAgain,
  onGoHome,
  onShare,
}: ResultModalProps) => {
  const missionProgress = missions.map((mission) => ({
    ...mission,
    percent: Math.round(Math.min(100, (mission.progress / mission.target) * 100)),
    remaining: Math.max(0, mission.target - mission.progress),
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="text-center space-y-6">
              {/* 축하 메시지 */}
              <motion.div
                className="text-6xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                🎉
              </motion.div>

              <h2 className="text-3xl font-bold text-textDark">완료!</h2>

              {/* 통계 */}
              <div className="space-y-3 bg-background rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg">⏱ 걸린 시간:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatTime(time)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg">🎯 시도:</span>
                  <span className="text-2xl font-bold text-secondary">
                    {attempts}번
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg">📊 정확도:</span>
                  <span className="text-2xl font-bold text-success">
                    {accuracy}%
                  </span>
                </div>
              </div>

              {/* 미션 진행도 */}
              <div className="space-y-3 bg-background rounded-xl p-6 border border-primary/10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <h3 className="text-lg font-bold text-textDark">미션 현황</h3>
                </div>
                <div className="space-y-3">
                  {missionProgress.map((mission) => (
                    <div key={mission.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-base">
                            {mission.type === 'daily' ? '🔥 오늘의 패스' : '📅 주간 패스'}
                          </span>
                          <span className="text-gray-600">{mission.description}</span>
                        </div>
                        <span
                          className={
                            mission.completed
                              ? 'text-success font-semibold'
                              : 'text-warning font-semibold'
                          }
                        >
                          {mission.progress}/{mission.target}
                        </span>
                      </div>
                      <div className="bg-white/70 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${mission.percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600">
                        {mission.completed
                          ? `보상 준비 완료 - 스킨 ${mission.reward.skin}, 효과음 ${mission.reward.effectSound}, 배지 ${mission.reward.badge}`
                          : `다음 목표까지 ${mission.remaining}회 더 플레이하면 보상: ${mission.reward.badge}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 신기록 배지 */}
              {isNewRecord && (
                <motion.div
                  className="bg-warning text-textDark px-6 py-3 rounded-full font-bold text-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                >
                  🏆 최고 기록 경신!
                </motion.div>
              )}

              {/* 버튼 */}
              <div className="space-y-3 pt-4">
                <Button
                  variant="success"
                  size="large"
                  fullWidth
                  onClick={onShare}
                  disabled={!onShare}
                >
                  결과 공유
                </Button>
                <Button variant="primary" size="large" fullWidth onClick={onPlayAgain}>
                  다시하기
                </Button>
                <Button variant="secondary" size="large" fullWidth onClick={onGoHome}>
                  홈으로
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
