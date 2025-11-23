import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProfileSelector } from '../components/profile/ProfileSelector';
import { Header } from '../components/common/Header';
import { AdSense } from '../components/common/AdSense';
import { useEffect, useMemo, useState } from 'react';

export const Home = () => {
  const navigate = useNavigate();
  const { profiles, currentProfileId } = useProfileStore();
  const getProfileStats = useGameStore((state) => state.getProfileStats);
  const getWeeklyRanking = useGameStore((state) => state.getWeeklyRanking);
  const recentHighlights = useGameStore((state) => state.getRecentHighlights());
  const weeklySummary = useGameStore((state) => state.getWeeklyHighlightSummary());
  const addHighlightReaction = useGameStore((state) => state.addHighlightReaction);

  const [showWeeklyReport, setShowWeeklyReport] = useState(false);

  const currentProfile = profiles.find((p) => p.id === currentProfileId);
  const stats = currentProfileId ? getProfileStats(currentProfileId) : null;
  const ranking = getWeeklyRanking();

  const recentHighlightCards = useMemo(
    () => recentHighlights.slice(0, 5),
    [recentHighlights]
  );

  useEffect(() => {
    if (weeklySummary) {
      setShowWeeklyReport(true);
    }
  }, [weeklySummary?.highlight.id]);

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

        {/* 가족 피드 */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-textDark">👪 가족 피드</h3>
            <span className="text-sm text-gray-500">
              최근 하이라이트 {recentHighlightCards.length}건
            </span>
          </div>

          {recentHighlightCards.length === 0 ? (
            <p className="text-gray-600 text-sm">아직 공유된 하이라이트가 없어요.</p>
          ) : (
            <div className="space-y-3">
              {recentHighlightCards.map((highlight) => {
                const profile = profiles.find((p) => p.id === highlight.profileId);
                return (
                  <div
                    key={highlight.id}
                    className="flex items-center gap-3 bg-background rounded-xl p-3"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white shadow flex items-center justify-center text-2xl">
                      {profile?.emoji ?? '🎮'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-textDark">
                          {profile?.name ?? '게스트'}
                        </span>
                        <span className="text-xs text-gray-500">{highlight.gameType}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        점수 {highlight.score} • 플레이 {highlight.playTime}초
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(highlight.createdAt).toLocaleString('ko-KR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">👏 {highlight.reactions}</span>
                      <Button
                        size="small"
                        variant="success"
                        onClick={() => addHighlightReaction(highlight.id)}
                      >
                        박수 보내기
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

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

      {/* 이번 주 최고 기록 팝업 */}
      {showWeeklyReport && weeklySummary && (
        <div className="fixed inset-0 bg-black/30 flex items-end justify-center p-4 z-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-bold text-textDark">이번 주 최고 기록</h4>
              <button
                onClick={() => setShowWeeklyReport(false)}
                className="text-xl leading-none"
                aria-label="주간 리포트 닫기"
              >
                ✖️
              </button>
            </div>
            <div className="flex items-center gap-3 bg-background rounded-xl p-4">
              <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center text-3xl">
                {
                  profiles.find((p) => p.id === weeklySummary.highlight.profileId)?.
                    emoji ?? '🌟'
                }
              </div>
              <div className="flex-1">
                <div className="font-bold text-textDark">
                  {
                    profiles.find((p) => p.id === weeklySummary.highlight.profileId)?.
                      name ?? '게스트'
                  }
                </div>
                <div className="text-sm text-gray-600">
                  {weeklySummary.highlight.gameType} • 점수 {weeklySummary.highlight.score}
                </div>
                <div className="text-xs text-gray-500">
                  공유 {weeklySummary.totalShares}회 · 반응 {weeklySummary.totalReactions}회
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              가족들의 공유와 반응을 모아 이번 주 최고 기록을 보여드려요!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
