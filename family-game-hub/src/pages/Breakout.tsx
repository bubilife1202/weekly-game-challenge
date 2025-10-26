import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { AdSense } from '../components/common/AdSense';
import { soundManager } from '../utils/sound';
import {
  createInitialState,
  movePaddle,
  startBall,
  updateGame,
  nextLevel,
  GAME_CONFIG,
  type GameState,
} from '../utils/breakout';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

export const Breakout = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameSize, setGameSize] = useState({ width: 400, height: 600 });
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  const { addRecord } = useGameStore();
  const { currentProfileId } = useProfileStore();

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const maxWidth = Math.min(screenWidth - 32, 400);
      const maxHeight = Math.min(screenHeight - 300, 600);
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

  // Start game
  const startGame = useCallback(() => {
    soundManager.playClick();
    setGameState(createInitialState(1));
    setShowInstructions(false);
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState || gameState.gameOver) return;

    const gameLoop = () => {
      setGameState((prev) => {
        if (!prev) return prev;
        const newState = updateGame(prev);

        // Game over check
        if (newState.gameOver && !prev.gameOver) {
          if (newState.won) {
            soundManager.playComplete();
          } else {
            soundManager.playMismatch();
          }

          // Save record
          if (currentProfileId) {
            addRecord({
              profileId: currentProfileId,
              gameType: 'breakout',
              difficulty: 'medium',
              score: newState.score,
              time: newState.level,
              completedAt: Date.now(),
            });
          }
        }

        return newState;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState, currentProfileId, addRecord]);

  // Touch/mouse controls
  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!gameState || gameState.gameOver) return;

      const rect = gameContainerRef.current?.getBoundingClientRect();
      if (!rect) return;

      let clientX: number;
      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
      } else {
        clientX = e.clientX;
      }

      const relativeX = clientX - rect.left;
      const scale = gameSize.width / GAME_CONFIG.width;
      const gameX = relativeX / scale;

      setGameState((prev) => {
        if (!prev) return prev;
        return movePaddle(prev, gameX - prev.paddle.width / 2);
      });
    },
    [gameState, gameSize]
  );

  const handleClick = useCallback(() => {
    if (!gameState || gameState.gameOver) return;
    setGameState((prev) => {
      if (!prev) return prev;
      return startBall(prev);
    });
  }, [gameState]);

  const handleNextLevel = useCallback(() => {
    if (!gameState) return;
    soundManager.playClick();
    setGameState(nextLevel(gameState));
  }, [gameState]);

  // Instructions screen
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <Header title="🧱 벽돌깨기" showBack />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-8xl">🧱</div>
            <h2 className="text-3xl font-bold text-white">벽돌깨기</h2>
            <p className="text-gray-300">
              패들을 움직여 공을 튕겨서 벽돌을 부수세요!
              <br />
              모든 벽돌을 깨면 다음 레벨로!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl p-6 space-y-4">
            <div className="font-bold text-white text-xl">🎮 조작법</div>
            <div className="text-white space-y-3">
              <div className="bg-blue-500/20 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📱</span>
                  <div className="flex-1">
                    <div className="font-bold text-lg">모바일</div>
                    <div className="text-sm text-gray-300">✨ 화면을 좌우로 드래그하여 패들 이동</div>
                    <div className="text-sm text-green-300">✅ 화면 탭으로 공 발사</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⌨️</span>
                <div>
                  <div className="font-bold">키보드</div>
                  <div className="text-sm text-gray-300">← → 또는 A D : 패들 이동</div>
                  <div className="text-sm text-gray-300">Space : 공 발사</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-xl p-6 space-y-2">
            <div className="font-bold text-white">🎯 게임 규칙:</div>
            <ul className="text-white text-sm space-y-1 ml-4">
              <li>• 🟢 녹색 벽돌: 1번에 부서짐 (10점)</li>
              <li>• 🟡 노란 벽돌: 2번 쳐야 부서짐 (20점)</li>
              <li>• 🔴 빨간 벽돌: 3번 쳐야 부서짐 (30점)</li>
              <li>• 공을 놓치면 생명 1개 감소</li>
              <li>• 모든 벽돌을 깨면 다음 레벨!</li>
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

  const scale = gameSize.width / GAME_CONFIG.width;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pb-6">
      <Header
        title="🧱 벽돌깨기"
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
        {/* Status display */}
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
              <div className="text-xs">생명</div>
            </div>
          </div>
        </div>

        {/* Game board */}
        <div className="bg-black/50 backdrop-blur rounded-xl p-2 sm:p-4 shadow-lg flex justify-center items-center">
          <div
            ref={gameContainerRef}
            className="relative bg-black border-4 border-purple-500 touch-none cursor-none"
            style={{
              width: gameSize.width,
              height: gameSize.height,
            }}
            onTouchMove={handleMove}
            onMouseMove={handleMove}
            onClick={handleClick}
          >
            {/* Bricks */}
            {gameState.bricks.map((brick, index) => {
              if (brick.broken) return null;
              return (
                <div
                  key={index}
                  className="absolute rounded transition-all duration-100"
                  style={{
                    left: brick.x * scale,
                    top: brick.y * scale,
                    width: brick.width * scale,
                    height: brick.height * scale,
                    backgroundColor: brick.color,
                    border: '1px solid rgba(0,0,0,0.2)',
                  }}
                />
              );
            })}

            {/* Ball */}
            <div
              className="absolute bg-white rounded-full shadow-lg"
              style={{
                left: (gameState.ball.x - gameState.ball.radius) * scale,
                top: (gameState.ball.y - gameState.ball.radius) * scale,
                width: gameState.ball.radius * 2 * scale,
                height: gameState.ball.radius * 2 * scale,
              }}
            />

            {/* Paddle */}
            <div
              className="absolute bg-blue-500 rounded-full shadow-lg"
              style={{
                left: gameState.paddle.x * scale,
                top: gameState.paddle.y * scale,
                width: gameState.paddle.width * scale,
                height: gameState.paddle.height * scale,
              }}
            />

            {/* Start prompt */}
            {!gameState.gameStarted && !gameState.gameOver && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">화면을 클릭/탭</div>
                  <div className="text-sm">공을 발사하세요!</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        {!gameState.gameOver && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg border-2 border-blue-400/50 rounded-xl p-3 text-center">
            <div className="text-white font-bold">
              🕹️ 화면을 좌우로 드래그 / 탭으로 발사
            </div>
            <div className="text-xs text-blue-200 mt-1">
              {gameState.gameStarted ? '공을 놓치지 마세요!' : '탭하여 시작하세요'}
            </div>
          </div>
        )}

        {/* Game over / Win message */}
        {gameState.gameOver && (
          <>
            <div
              className={`${
                gameState.won
                  ? 'bg-gradient-to-r from-yellow-50 to-green-50 border-yellow-400'
                  : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-400'
              } border-4 rounded-2xl p-6 shadow-xl text-center space-y-4 animate-bounce-in`}
            >
              <div className="text-6xl">{gameState.won ? '🎉' : '💥'}</div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-textDark">
                  {gameState.won ? '레벨 클리어!' : 'Game Over!'}
                </h2>
                <div className="text-lg text-gray-700">
                  <div>점수: {gameState.score}</div>
                  <div>레벨: {gameState.level}</div>
                </div>
              </div>
              <div className="flex gap-3">
                {gameState.won ? (
                  <>
                    <Button variant="primary" onClick={handleNextLevel} fullWidth>
                      ⬆️ 다음 레벨
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowInstructions(true)}
                      fullWidth
                    >
                      🔄 새 게임
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

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
