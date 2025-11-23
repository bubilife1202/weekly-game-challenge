import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { useSettingsStore } from '../store/settingsStore';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProfileSelector } from '../components/profile/ProfileSelector';
import { Header } from '../components/common/Header';
import { AdSense } from '../components/common/AdSense';

const weeklyRecommendations = [
  {
    id: 'memory',
    title: '카드 뒤집기',
    icon: '🃏',
    description: '난이도별 기억력 향상 미션',
    difficulty: 'easy' as const,
    age: '6세+',
    playTime: '5~10분',
  },
  {
    id: 'maze',
    title: '미로 찾기',
    icon: '🌟',
    description: '길을 찾으며 공간지각력 키우기',
    difficulty: 'medium' as const,
    age: '8세+',
    playTime: '5~10분',
  },
  {
    id: '2048',
    title: '2048',
    icon: '🔢',
    description: '숫자를 합쳐 목표 점수 도전',
    difficulty: 'hard' as const,
    age: '10세+',
    playTime: '5~10분',
  },
];

export const Home = () => {
  const navigate = useNavigate();
  const { profiles, currentProfileId } = useProfileStore();
  const {
    getProfileStats,
    getWeeklyRanking,
    weeklyChallenge,
    refreshWeeklyChallenge,
    getWeeklyChallengeProgress,
    claimWeeklyReward,
  } = useGameStore();
  const { soundEnabled, volume } = useSettingsStore();
  const [now, setNow] = useState(Date.now());
  const [showTrophyCelebration, setShowTrophyCelebration] = useState(false);
  const celebrationTimeoutRef = useRef<number | undefined>();

  const currentProfile = profiles.find((p) => p.id === currentProfileId);
  const stats = currentProfileId ? getProfileStats(currentProfileId) : null;
  const ranking = getWeeklyRanking();

  useEffect(() => {
    refreshWeeklyChallenge();
  }, [refreshWeeklyChallenge]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(
    () => () => {
      if (celebrationTimeoutRef.current) {
        window.clearTimeout(celebrationTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (now > weeklyChallenge.deadline) {
      refreshWeeklyChallenge();
    }
  }, [now, refreshWeeklyChallenge, weeklyChallenge.deadline]);

  const challengeProgress = useMemo(
    () => getWeeklyChallengeProgress(),
    [getWeeklyChallengeProgress, now]
  );

  const challengeCompleted = challengeProgress.isCompleted;
  const remainingMs = Math.max(weeklyChallenge.deadline - now, 0);

  const remainingTimeText = useMemo(() => {
    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);

    if (days > 0) return `${days}일 ${hours}시간`;
    if (hours > 0) return `${hours}시간 ${minutes}분`;
    return `${minutes}분 남음`;
  }, [remainingMs]);

  const playTrophySound = useCallback(() => {
    if (!soundEnabled) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const duration = 0.65;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(660, context.currentTime);
    oscillator.frequency.linearRampToValueAtTime(990, context.currentTime + duration);
    gainNode.gain.setValueAtTime(Math.min(Math.max(volume, 0), 1) * 0.5, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
    oscillator.onended = () => context.close();
  }, [soundEnabled, volume]);

  const triggerTrophyCelebration = useCallback(() => {
    setShowTrophyCelebration(true);
    playTrophySound();
    if (celebrationTimeoutRef.current) {
      window.clearTimeout(celebrationTimeoutRef.current);
    }
    celebrationTimeoutRef.current = window.setTimeout(
      () => setShowTrophyCelebration(false),
      2200
    );
  }, [playTrophySound]);

  const handleClaimReward = () => {
    if (!challengeCompleted || weeklyChallenge.rewardClaimed) return;
    claimWeeklyReward();
    triggerTrophyCelebration();
  };

  // 버전 정보
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';

  // 프로필이 없으면 간단한 안내만 표시 (게스트 모드 가능)

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="🎮 Family Game Hub"
        rightElement={
          <button
            onClick={() => navigate('/profiles')}
            className="text-2xl active:scale-90 transition-transform"
            aria-label="프로필 관리"
          >
            ⚙️
          </button>
        }
      />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* 프로필 선택 또는 게스트 안내 */}
        {profiles.length > 0 ? (
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-textDark">플레이어:</span>
            <ProfileSelector />
          </div>
        ) : (
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-dashed border-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-textDark mb-1">
                  🎮 게스트 모드
                </h3>
                <p className="text-sm text-gray-600">
                  지금 바로 플레이하거나, 기록 저장을 위해 프로필을 만드세요
                </p>
              </div>
              <Button
                variant="secondary"
                size="small"
                onClick={() => navigate('/profiles')}
              >
                프로필 만들기
              </Button>
            </div>
          </Card>
        )}

        {/* 이번 주 가족 챌린지 */}
        <Card
          badgeLabel="WEEKLY"
          difficulty="family"
          playTime="5~10분"
          className="overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">이번 주 가족 챌린지</p>
                <h3 className="text-2xl font-bold text-textDark">
                  {weeklyChallenge.mission}
                </h3>
                <p className="text-sm text-gray-500">
                  보상 스탬프: {weeklyChallenge.rewardStamp}
                </p>
              </div>
              <div className="bg-secondary/10 text-secondary border border-secondary/20 rounded-xl px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-wide font-semibold">남은 시간</p>
                <p className="text-lg font-bold">{remainingTimeText}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>진행도</span>
                <span className="font-semibold">
                  {challengeProgress.count} / {challengeProgress.target}
                </span>
              </div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      (challengeProgress.count / challengeProgress.target) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                🏷️ 이번 주 추천 게임을 플레이하고 트로피를 모아보세요.
              </p>
              <div className="flex items-center gap-3">
                {weeklyChallenge.rewardClaimed && (
                  <span className="text-green-600 font-semibold flex items-center gap-2">
                    🏆 가족 트로피 지급 완료
                  </span>
                )}
                {!weeklyChallenge.rewardClaimed && (
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleClaimReward}
                    disabled={!challengeCompleted}
                  >
                    {challengeCompleted ? '가족 트로피 받기' : '미션 진행 중'}
                  </Button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {showTrophyCelebration && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-gradient-to-r from-yellow-100 to-amber-100 border border-amber-200 rounded-xl p-4 flex items-center gap-3 shadow-inner"
                >
                  <motion.span
                    initial={{ scale: 0.6, rotate: -10 }}
                    animate={{ scale: 1.1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 12 }}
                    className="text-3xl"
                  >
                    🏆
                  </motion.span>
                  <div>
                    <p className="text-sm text-amber-800 font-semibold">가족 트로피 지급 완료!</p>
                    <p className="text-xs text-amber-700">설정된 사운드와 함께 축하드려요 🎉</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* 이번 주 추천 게임 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-textDark">이번 주 가족 추천</h2>
            <span className="text-sm text-gray-500">연령과 난이도에 맞춘 5~10분 코스</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {weeklyRecommendations.map((game) => (
              <Card
                key={game.id}
                onClick={() => navigate(`/game/${game.id}`)}
                badgeLabel="추천"
                difficulty={game.difficulty}
                playTime={game.playTime}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{game.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-textDark">{game.title}</h3>
                      <p className="text-sm text-gray-600">{game.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>권장 연령: {game.age}</span>
                    <span>예상 플레이: {game.playTime}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 게임 목록 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-textDark">게임 선택</h2>

          {/* 카드 뒤집기 게임 */}
          <Card onClick={() => navigate('/game/memory')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🃏</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">
                      카드 뒤집기
                    </h3>
                    <p className="text-sm text-gray-600">
                      같은 카드를 찾아보세요!
                    </p>
                  </div>
                </div>
                {stats && stats.bestRecords.easy && (
                  <div className="flex gap-2 text-sm text-gray-600 ml-14">
                    <span>⭐ 최고기록:</span>
                    <span className="font-bold text-primary">
                      {stats.bestRecords.easy.time}초
                    </span>
                  </div>
                )}
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 색칠하기 게임 */}
          <Card onClick={() => navigate('/game/coloring')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🎨</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">색칠하기</h3>
                    <p className="text-sm text-gray-600">마음껏 색칠해보세요!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 세계 지도 퀴즈 */}
          <Card onClick={() => navigate('/game/world-map')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🌍</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">세계 지도 퀴즈</h3>
                    <p className="text-sm text-gray-600">나라와 수도를 배워요!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 영어 단어 외우기 */}
          <Card onClick={() => navigate('/game/english-words')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🔤</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">영어 단어 외우기</h3>
                    <p className="text-sm text-gray-600">학년별 영어 단어 학습!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 영어 문장 만들기 */}
          <Card onClick={() => navigate('/game/english-sentences')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">📖</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">영어 문장 만들기</h3>
                    <p className="text-sm text-gray-600">3가지 모드로 문장 학습!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 스도쿠 */}
          <Card onClick={() => navigate('/game/sudoku')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🧩</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">스도쿠</h3>
                    <p className="text-sm text-gray-600">논리적 사고력 향상!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 미로 찾기 */}
          <Card onClick={() => navigate('/game/maze')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🌟</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">미로 찾기</h3>
                    <p className="text-sm text-gray-600">길을 찾아 골인!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* Snake 게임 */}
          <Card onClick={() => navigate('/game/snake')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🐍</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">Snake 게임</h3>
                    <p className="text-sm text-gray-600">먹고 길어지기!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 2048 */}
          <Card onClick={() => navigate('/game/2048')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🔢</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">2048</h3>
                    <p className="text-sm text-gray-600">합쳐서 2048 만들기!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 지뢰찾기 */}
          <Card onClick={() => navigate('/game/minesweeper')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">💣</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">지뢰찾기</h3>
                    <p className="text-sm text-gray-600">논리로 지뢰 찾기!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 갤러그 */}
          <Card onClick={() => navigate('/game/galaga')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🚀</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">갤러그</h3>
                    <p className="text-sm text-gray-600">우주 슈팅 게임!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 벽돌깨기 */}
          <Card onClick={() => navigate('/game/breakout')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🧱</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">벽돌깨기</h3>
                    <p className="text-sm text-gray-600">패들로 공을 튕겨요!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 슈퍼 점프맨 */}
          <Card onClick={() => navigate('/game/mario')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🍄</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">슈퍼 점프맨</h3>
                    <p className="text-sm text-gray-600">점프하고 달려요!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>

          {/* 바람의 유산 */}
          <Card onClick={() => navigate('/game/wind-legacy')}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🌪️</span>
                  <div>
                    <h3 className="text-xl font-bold text-textDark">바람의 유산</h3>
                    <p className="text-sm text-gray-600">시간을 되감고 퍼즐을 풀어요!</p>
                  </div>
                </div>
              </div>
              <div className="text-2xl">→</div>
            </div>
          </Card>
        </div>

        {/* 광고 영역 */}
        <AdSense className="my-6" />

        {/* 주간 랭킹 */}
        {ranking.length > 0 && (
          <Card>
            <h3 className="text-xl font-bold text-textDark mb-4">
              🏆 이번 주 챔피언
            </h3>
            <div className="space-y-3">
              {ranking.slice(0, 3).map((rank, index) => {
                const profile = profiles.find((p) => p.id === rank.profileId);
                if (!profile) return null;

                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div
                    key={rank.profileId}
                    className="flex items-center justify-between bg-background rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{medals[index]}</span>
                      <span className="text-xl">{profile.emoji}</span>
                      <span className="font-medium text-textDark">
                        {profile.name}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-secondary">
                      {rank.count}회
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* 통계 */}
        {stats && stats.totalGames > 0 && (
          <Card>
            <h3 className="text-xl font-bold text-textDark mb-4">
              📊 {currentProfile?.name}의 기록
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-primary">
                  {stats.totalGames}
                </div>
                <div className="text-sm text-gray-600 mt-1">총 게임</div>
              </div>
              <div className="bg-background rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-secondary">
                  {Math.floor(stats.totalTime / 60)}
                </div>
                <div className="text-sm text-gray-600 mt-1">총 시간 (분)</div>
              </div>
            </div>
          </Card>
        )}

        {/* 버전 정보 */}
        <div className="text-center py-6 text-sm text-gray-500">
          <p>Family Game Hub v{version}</p>
          <p className="text-xs mt-1">© 2025 All rights reserved</p>
        </div>
      </div>
    </div>
  );
};
