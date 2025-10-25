import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProfileSelector } from '../components/profile/ProfileSelector';
import { Header } from '../components/common/Header';

export const Home = () => {
  const navigate = useNavigate();
  const { profiles, currentProfileId } = useProfileStore();
  const { getProfileStats, getWeeklyRanking } = useGameStore();

  const currentProfile = profiles.find((p) => p.id === currentProfileId);
  const stats = currentProfileId ? getProfileStats(currentProfileId) : null;
  const ranking = getWeeklyRanking();

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
        </div>

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
      </div>
    </div>
  );
};
