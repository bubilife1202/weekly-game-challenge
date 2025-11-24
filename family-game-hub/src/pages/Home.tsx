import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProfileSelector } from '../components/profile/ProfileSelector';
import { Header } from '../components/common/Header';
import { AdSense } from '../components/common/AdSense';
import { SEO } from '../components/common/SEO';
import { Leaderboard } from '../components/common/Leaderboard';
import { useEffect } from 'react';
import type { GameCategory } from '../types';

interface GameRecommendation {
  id: string;
  title: string;
  description: string;
  emoji: string;
  path: string;
  category: GameCategory;
}

const ALL_GAMES: GameRecommendation[] = [
  { id: 'memory', title: '카드 뒤집기', description: '기억력을 테스트해보세요!', emoji: '🃏', path: '/game/memory', category: 'puzzle' },
  { id: 'coloring', title: '색칠하기', description: '창의력을 발휘해보세요!', emoji: '🎨', path: '/game/coloring', category: 'creativity' },
  { id: 'world-map', title: '세계 지도 퀴즈', description: '나라와 수도를 배워요!', emoji: '🌍', path: '/game/world-map', category: 'learning' },
  { id: 'english-words', title: '영어 단어 외우기', description: '학년별 영어 단어 학습!', emoji: '🔤', path: '/game/english-words', category: 'learning' },
  { id: 'english-sentences', title: '영어 문장 만들기', description: '3가지 모드로 문장 학습!', emoji: '📖', path: '/game/english-sentences', category: 'learning' },
  { id: 'sudoku', title: '스도쿠', description: '논리적 사고력 향상!', emoji: '🧩', path: '/game/sudoku', category: 'puzzle' },
  { id: 'maze', title: '미로 찾기', description: '길을 찾아 골인!', emoji: '🌟', path: '/game/maze', category: 'puzzle' },
  { id: 'snake', title: '스네이크', description: '꼬리가 길어지지 않게 조심!', emoji: '🐍', path: '/game/snake', category: 'action' },
  { id: '2048', title: '2048', description: '합쳐서 2048 만들기!', emoji: '🔢', path: '/game/2048', category: 'puzzle' },
  { id: 'minesweeper', title: '지뢰찾기', description: '논리로 지뢰 찾기!', emoji: '💣', path: '/game/minesweeper', category: 'puzzle' },
  { id: 'galaga', title: '갤러그', description: '우주 슈팅 게임!', emoji: '🚀', path: '/game/galaga', category: 'action' },
  { id: 'breakout', title: '벽돌깨기', description: '패들로 공을 튕겨요!', emoji: '🧱', path: '/game/breakout', category: 'action' },
  { id: 'mario', title: '슈퍼 점프맨', description: '점프하고 달려요!', emoji: '🍄', path: '/game/mario', category: 'action' },
  { id: 'wind-legacy', title: '바람의 유산', description: '시간을 되감고 퍼즐을 풀어요!', emoji: '🌪️', path: '/game/wind-legacy', category: 'action' },
];

export const Home = () => {
  const navigate = useNavigate();
  const { profiles, currentProfileId } = useProfileStore();
  const {
    getProfileStats,
    getWeeklyRanking,
    dailyMission,
    weeklyMission,
    league,
    refreshProgress,
  } = useGameStore();

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const currentProfile = profiles.find((p) => p.id === currentProfileId);
  const stats = currentProfileId ? getProfileStats(currentProfileId) : null;
  const ranking = getWeeklyRanking();
  const dailyProgress = Math.round(
    Math.min(100, (dailyMission.progress / dailyMission.target) * 100)
  );
  const weeklyRemaining = Math.max(0, weeklyMission.target - weeklyMission.progress);

  const tierIcons: Record<string, string> = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
    diamond: '👑',
  };


  // 버전 정보
  const version = import.meta.env.VITE_APP_VERSION || '1.0.0';

  // 프로필이 없으면 간단한 안내만 표시 (게스트 모드 가능)

  return (
    <div className="min-h-screen bg-background">
      <SEO />
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
        {/* 오늘의 패스 */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <p className="text-sm text-white/80">오늘의 패스</p>
                  <h3 className="text-2xl font-bold">{dailyMission.description}</h3>
                </div>
              </div>

              <div className="bg-white/30 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{ width: `${dailyProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>
                  {dailyMission.progress}/{dailyMission.target}회 완료
                </span>
                <span className="text-white/90">
                  {dailyMission.completed
                    ? '보상 받을 준비 완료!'
                    : `남은 목표 ${dailyMission.target - dailyMission.progress}회`}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  🎭 스킨: {dailyMission.reward.skin}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  🎵 효과음: {dailyMission.reward.effectSound}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  🛡 배지: {dailyMission.reward.badge}
                </span>
              </div>

              <p className="text-xs text-white/80">
                주간 패스 {weeklyMission.progress}/{weeklyMission.target} 진행 중 · 남은 목표
                {` ${weeklyRemaining}회`}
              </p>
            </div>

            <div className="bg-white/15 text-center rounded-2xl px-4 py-5 min-w-[140px]">
              <p className="text-sm text-white/80">가족 리그</p>
              <div className="text-4xl my-1">{tierIcons[league.tier]}</div>
              <p className="text-xl font-bold">{league.tier.toUpperCase()}</p>
              <p className="text-xs text-white/70 mt-1">이번 달 포인트 {league.points}</p>
            </div>
          </div>
        </Card>

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

        {/* 맞춤 추천 */}
        {currentProfile && (
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🎯</span>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-textDark">맞춤 추천</h3>
                  <span className="text-xs text-gray-500">{currentProfile.name} 전용</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {ALL_GAMES.filter(g => currentProfile.preferences?.favoriteTypes.includes(g.category)).slice(0, 3).map((game) => (
                    <button
                      key={game.id}
                      onClick={() => navigate(game.path)}
                      className="flex items-start gap-3 rounded-xl border border-primary/20 bg-white/70 p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <span className="text-2xl">{game.emoji}</span>
                      <div>
                        <div className="font-semibold text-textDark">{game.title}</div>
                        <p className="text-xs text-gray-600 leading-snug">{game.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 가족 미션 */}
        {currentProfile && currentProfile.missions && (
          <Card>
            <div className="flex items-start gap-3">
              <span className="text-3xl">🗓️</span>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-textDark">이번 주 가족 미션</h3>
                  <span className="text-xs text-gray-500">협동 · 경쟁 · 학습</span>
                </div>
                <div className="space-y-2">
                  {currentProfile.missions.map((mission) => (
                    <div
                      key={mission.id}
                      className="flex items-start gap-3 rounded-xl bg-background p-3"
                    >
                      <div className="text-2xl">
                        {mission.category === 'cooperative'
                          ? '🤝'
                          : mission.category === 'competitive'
                            ? '🏁'
                            : '📚'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-textDark">{mission.title}</div>
                            <p className="text-sm text-gray-600">{mission.description}</p>
                          </div>
                          {mission.completed && (
                            <span className="text-sm text-secondary font-semibold">완료!</span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <span>{mission.rewardBadge.emoji}</span>
                            <span>{mission.rewardBadge.name} 배지</span>
                          </div>
                          <Button
                            variant={mission.completed ? 'secondary' : 'primary'}
                            size="small"
                            onClick={() => {}}
                            disabled={mission.completed}
                          >
                            {mission.completed ? '완료됨' : '완료 표시'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* 게임 목록 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-textDark">게임 선택</h2>
          {ALL_GAMES.map((game) => (
             <Card key={game.id} onClick={() => navigate(game.path)}>
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{game.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold text-textDark">
                        {game.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {game.description}
                      </p>
                    </div>
                  </div>
                  {/* 통계 (Memory Game 전용) */}
                  {game.id === 'memory' && stats && stats.bestRecords.easy && (
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
          ))}
        </div>

        {/* 광고 영역 */}
        <AdSense className="my-6" />


        {/* 글로벌 리더보드 (New) */}
        <div className="mb-6">
           <Leaderboard />
        </div>

        {/* 주간 랭킹 (Local) */}
        {ranking.length > 0 && (
          <Card>
            <h3 className="text-xl font-bold text-textDark mb-4">
              🏠 우리 집 챔피언
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

        {/* 가족 리그 현황 */}
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">월간 가족 리그</p>
              <h3 className="text-xl font-bold text-textDark">
                {tierIcons[league.tier]} 현재 티어: {league.tier.toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600">
                이번 달 누적 포인트 <span className="text-primary font-semibold">{league.points}</span>
              </p>
              <p className="text-xs text-gray-500">매월 1일 00시에 리셋되며 티어별 한정 배지가 지급돼요.</p>
              {league.lastBadge && (
                <p className="text-xs text-success">
                  지난 {league.lastBadge.monthKey}에 {league.lastBadge.tier.toUpperCase()} 배지를 획득했어요!
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-4xl">{tierIcons[league.tier]}</div>
              <div className="text-sm text-gray-500">점수로 티어 승급</div>
            </div>
          </div>
        </Card>

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
