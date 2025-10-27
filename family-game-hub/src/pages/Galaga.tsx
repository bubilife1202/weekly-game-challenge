import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { AdSense } from '../components/common/AdSense';
import { soundManager } from '../utils/sound';
import {
  createInitialState,
  createEnemies,
  createBullet,
  movePlayer,
  moveBullets,
  moveEnemies,
  checkCollisions,
  getEnemyEmoji,
  GAME_CONFIG,
  type GameState,
} from '../utils/galaga';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

export const Galaga = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [autoFire, setAutoFire] = useState(true); // 모바일 기본값 true
  const keysPressed = useRef<Set<string>>(new Set());
  const touchStartX = useRef<number>(0);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameSize, setGameSize] = useState({ width: 400, height: 600 });

  const { addRecord } = useGameStore();
  const { currentProfileId } = useProfileStore();

  // 게임 크기를 화면에 맞게 조정
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // 모바일 화면에 맞게 크기 조정
      const maxWidth = Math.min(screenWidth - 32, 400);
      const maxHeight = Math.min(screenHeight - 400, 600); // 상태표시, 컨트롤 공간 확보

      // 비율 유지하면서 크기 조정
      const scale = Math.min(maxWidth / 400, maxHeight / 600);

      setGameSize({
        width: 400 * scale,
        height: 600 * scale,
      });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    soundManager.playClick();
    const initialState = createInitialState();
    initialState.enemies = createEnemies(1);
    setGameState(initialState);
    setShowInstructions(false);
    setIsPaused(false);
  }, []);

  // 게임 루프
  useEffect(() => {
    if (!gameState || gameState.gameOver || isPaused) return;

    const gameLoop = setInterval(() => {
      setGameState((prevState) => {
        if (!prevState) return prevState;

        let newState = { ...prevState };

        // 플레이어 이동
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
          newState = movePlayer(newState, 'left');
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
          newState = movePlayer(newState, 'right');
        }

        // 총알 이동
        newState = moveBullets(newState);

        // 적 이동
        newState = moveEnemies(newState);

        // 충돌 감지
        newState = checkCollisions(newState);

        // 게임 오버 체크
        if (newState.lives <= 0 && !prevState.gameOver) {
          newState.gameOver = true;
          soundManager.playMismatch();

          // 게임 결과 저장
          if (currentProfileId) {
            addRecord({
              profileId: currentProfileId,
              gameType: 'galaga',
              difficulty: 'medium',
              score: newState.score,
              time: newState.level,
              completedAt: Date.now(),
            });
          }
        }

        return newState;
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameState, isPaused, currentProfileId, addRecord]);

  // 자동 발사
  useEffect(() => {
    if (!gameState || gameState.gameOver || isPaused || !autoFire) return;

    const autoFireInterval = setInterval(() => {
      setGameState((prev) => {
        if (!prev || prev.gameOver || prev.bullets.length >= 3) return prev;
        soundManager.playClick();
        return {
          ...prev,
          bullets: [...prev.bullets, createBullet(prev.playerX)],
        };
      });
    }, 300); // 300ms마다 자동 발사

    return () => clearInterval(autoFireInterval);
  }, [gameState?.gameOver, isPaused, autoFire]);

  // 키보드 컨트롤
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (!gameState || gameState.gameOver) return;
        if (isPaused) {
          setIsPaused(false);
        } else {
          // 총알 발사
          if (!autoFire && gameState.bullets.length < 3) {
            // 최대 3발
            setGameState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                bullets: [...prev.bullets, createBullet(prev.playerX)],
              };
            });
            soundManager.playClick();
          }
        }
        return;
      }

      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsPaused((p) => !p);
        return;
      }

      keysPressed.current.add(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, isPaused, autoFire]);

  // 터치 드래그 컨트롤 - 개선된 버전
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!gameState || gameState.gameOver || isPaused) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
  }, [gameState, isPaused]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!gameState || gameState.gameOver || isPaused) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = touch.clientX - rect.left;

    // 화면 비율에 맞게 조정
    const scale = gameSize.width / GAME_CONFIG.width;
    const gameX = relativeX / scale;

    // 터치 위치로 플레이어 이동
    setGameState((prev) => {
      if (!prev) return prev;
      const newX = Math.max(
        GAME_CONFIG.playerWidth / 2,
        Math.min(GAME_CONFIG.width - GAME_CONFIG.playerWidth / 2, gameX)
      );
      return { ...prev, playerX: newX };
    });
  }, [gameState, isPaused, gameSize]);

  // 시작 화면
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
        <Header title="🚀 갤러그" showBack />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-8xl">🚀</div>
            <h2 className="text-3xl font-bold text-white">갤러그</h2>
            <p className="text-gray-300">
              우주선을 조종해서 적을 물리치세요!
              <br />
              레벨이 올라갈수록 더 많은 적이 나타납니다!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl p-6 space-y-4">
            <div className="font-bold text-white text-xl">🎮 조작법</div>
            <div className="text-white space-y-3">
              <div className="bg-blue-500/20 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📱</span>
                  <div className="flex-1">
                    <div className="font-bold text-lg">모바일 (추천!)</div>
                    <div className="text-sm text-gray-300">✨ 게임판을 좌우로 드래그</div>
                    <div className="text-sm text-green-300">✅ 자동 발사 기본 ON</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⌨️</span>
                <div>
                  <div className="font-bold">키보드</div>
                  <div className="text-sm text-gray-300">← → 또는 A D : 이동</div>
                  <div className="text-sm text-gray-300">Space : 발사 / P : 일시정지</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl p-6 space-y-2">
            <div className="font-bold text-white">🎯 점수:</div>
            <ul className="text-white text-sm space-y-1 ml-4">
              <li>• 👾 빨간 적: 10점</li>
              <li>• 🛸 파란 적: 20점</li>
              <li>• 🚀 보라 적: 30점</li>
            </ul>
          </div>

          <Button variant="primary" onClick={startGame} fullWidth>
            🎮 게임 시작
          </Button>
        </div>
      </div>
    );
  }

  if (!gameState) return null;

  // 게임 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black pb-6">
      <Header
        title="🚀 갤러그"
        showBack
        rightElement={
          <button
            onClick={() => setShowInstructions(true)}
            className="text-sm font-bold text-white hover:text-gray-300 active:scale-95"
          >
            새 게임
          </button>
        }
      />

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 상태 표시 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 shadow-md">
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <div className="text-2xl font-bold">{gameState.score}</div>
              <div className="text-xs">점수</div>
            </div>
            <div>
              <div className="text-2xl font-bold">LV.{gameState.level}</div>
              <div className="text-xs">레벨</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {'❤️'.repeat(gameState.lives)}
              </div>
              <div className="text-xs">목숨</div>
            </div>
          </div>
        </div>

        {/* 게임 보드 */}
        <div className="bg-black/50 backdrop-blur rounded-xl p-2 sm:p-4 shadow-lg flex justify-center items-center">
          <div
            ref={gameContainerRef}
            className="relative bg-black border-4 border-blue-500 touch-none"
            style={{
              width: gameSize.width,
              height: gameSize.height,
              transform: `scale(1)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {/* 적 */}
            {gameState.enemies.map((enemy) => {
              const scale = gameSize.width / GAME_CONFIG.width;
              return (
                <div
                  key={enemy.id}
                  className="absolute text-center transition-all duration-75"
                  style={{
                    left: (enemy.x - GAME_CONFIG.enemyWidth / 2) * scale,
                    top: (enemy.y - GAME_CONFIG.enemyHeight / 2) * scale,
                    width: GAME_CONFIG.enemyWidth * scale,
                    height: GAME_CONFIG.enemyHeight * scale,
                    fontSize: GAME_CONFIG.enemyWidth * scale,
                  }}
                >
                  {getEnemyEmoji(enemy.type)}
                </div>
              );
            })}

            {/* 총알 */}
            {gameState.bullets.map((bullet) => {
              const scale = gameSize.width / GAME_CONFIG.width;
              return (
                <div
                  key={bullet.id}
                  className="absolute bg-yellow-400 rounded-full"
                  style={{
                    left: (bullet.x - GAME_CONFIG.bulletWidth / 2) * scale,
                    top: bullet.y * scale,
                    width: GAME_CONFIG.bulletWidth * scale,
                    height: GAME_CONFIG.bulletHeight * scale,
                  }}
                />
              );
            })}

            {/* 플레이어 */}
            <div
              className="absolute text-center"
              style={{
                left: (gameState.playerX - GAME_CONFIG.playerWidth / 2) * (gameSize.width / GAME_CONFIG.width),
                bottom: 10 * (gameSize.width / GAME_CONFIG.width),
                width: GAME_CONFIG.playerWidth * (gameSize.width / GAME_CONFIG.width),
                height: GAME_CONFIG.playerHeight * (gameSize.width / GAME_CONFIG.width),
                fontSize: GAME_CONFIG.playerWidth * (gameSize.width / GAME_CONFIG.width),
              }}
            >
              🚀
            </div>

            {/* 일시정지 오버레이 */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div className="text-white text-4xl font-bold">일시정지</div>
              </div>
            )}
          </div>
        </div>

        {/* 컨트롤 */}
        {!gameState.gameOver && (
          <div className="space-y-3">
            {/* 일시정지 & 자동발사 토글 */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={isPaused ? 'primary' : 'secondary'}
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? '▶️ 계속' : '⏸️'}
              </Button>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 flex items-center justify-between cursor-pointer" onClick={() => setAutoFire(!autoFire)}>
                <span className="text-white font-bold text-sm">🎯 자동발사</span>
                <div className={`w-12 h-6 rounded-full transition-colors ${autoFire ? 'bg-green-500' : 'bg-gray-600'} relative`}>
                  <div className={`absolute top-0.5 ${autoFire ? 'left-6' : 'left-0.5'} w-5 h-5 bg-white rounded-full transition-all`}></div>
                </div>
              </div>
            </div>

            {/* 모바일 조작 안내 */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border-2 border-blue-400/50 rounded-xl p-3 text-center">
              <div className="text-white font-bold">
                🕹️ 게임판을 좌우로 드래그
              </div>
              <div className="text-xs text-blue-200 mt-1">
                {autoFire ? '✅ 자동 공격 중' : '⚠️ 자동 발사를 켜세요'}
              </div>
            </div>
          </div>
        )}

        {/* 게임 오버 메시지 */}
        {gameState.gameOver && (
          <>
            <div className="bg-red-500/20 backdrop-blur-lg border-4 border-red-500 rounded-2xl p-6 shadow-xl text-center space-y-4 animate-bounce-in">
              <div className="text-6xl">💥</div>
              <div className="space-y-2 text-white">
                <h2 className="text-3xl font-bold">Game Over!</h2>
                <div className="text-lg">
                  <div>점수: {gameState.score}</div>
                  <div>레벨: {gameState.level}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={startGame} fullWidth>
                  🔄 다시 하기
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowInstructions(true)}
                  fullWidth
                >
                  📋 메뉴
                </Button>
              </div>
            </div>

            {/* 게임 오버 후 광고 */}
            <AdSense className="my-4" />
          </>
        )}
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};
