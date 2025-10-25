import { useLevelStore, getXPForNextLevel, getXPProgress, getLevelName } from '../../store/levelStore';

interface XPProgressBarProps {
  showDetails?: boolean;
  compact?: boolean;
}

export const XPProgressBar = ({ showDetails = true, compact = false }: XPProgressBarProps) => {
  const { currentLevel, currentXP, totalXP } = useLevelStore();
  const xpNeeded = getXPForNextLevel(currentLevel);
  const progress = getXPProgress(currentXP, currentLevel);
  const levelName = getLevelName(currentLevel);

  const isMaxLevel = currentLevel >= 10;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-primary">Lv.{currentLevel}</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px]">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-600">{progress}%</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md space-y-2">
      {/* 레벨 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-3xl">🏆</div>
          <div>
            <div className="text-lg font-bold text-textDark">
              레벨 {currentLevel} - {levelName}
            </div>
            {showDetails && !isMaxLevel && (
              <div className="text-sm text-gray-600">
                다음 레벨까지: {xpNeeded - currentXP} XP
              </div>
            )}
            {isMaxLevel && (
              <div className="text-sm text-yellow-600 font-bold">
                ⭐ 최고 레벨 달성!
              </div>
            )}
          </div>
        </div>
        {showDetails && (
          <div className="text-right">
            <div className="text-sm text-gray-600">총 XP</div>
            <div className="text-lg font-bold text-secondary">{totalXP}</div>
          </div>
        )}
      </div>

      {/* 진행률 바 */}
      {!isMaxLevel && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>{currentXP} XP</span>
            <span>{xpNeeded} XP</span>
          </div>
          <div className="relative bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-success rounded-full transition-all duration-500 flex items-center justify-center"
              style={{ width: `${progress}%` }}
            >
              {progress > 20 && (
                <span className="text-xs font-bold text-white">{progress}%</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
