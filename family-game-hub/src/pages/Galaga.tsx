import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
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
  const keysPressed = useRef<Set<string>>(new Set());

  const { addRecord } = useGameStore();
  const { currentProfileId } = useProfileStore();

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
          if (gameState.bullets.length < 3) {
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
  }, [gameState, isPaused]);

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
            <div className="text-white space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⌨️</span>
                <div>
                  <div className="font-bold">키보드</div>
                  <div className="text-sm text-gray-300">
                    ← → 또는 A D : 이동
                  </div>
                  <div className="text-sm text-gray-300">Space : 발사</div>
                  <div className="text-sm text-gray-300">P : 일시정지</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <div className="font-bold">모바일</div>
                  <div className="text-sm text-gray-300">화면 하단 버튼 사용</div>
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
        <div className="bg-black/50 backdrop-blur rounded-xl p-4 shadow-lg flex justify-center items-center">
          <div
            className="relative bg-black border-4 border-blue-500"
            style={{
              width: GAME_CONFIG.width,
              height: GAME_CONFIG.height,
            }}
          >
            {/* 적 */}
            {gameState.enemies.map((enemy) => (
              <div
                key={enemy.id}
                className="absolute text-center transition-all duration-75"
                style={{
                  left: enemy.x - GAME_CONFIG.enemyWidth / 2,
                  top: enemy.y - GAME_CONFIG.enemyHeight / 2,
                  width: GAME_CONFIG.enemyWidth,
                  height: GAME_CONFIG.enemyHeight,
                  fontSize: GAME_CONFIG.enemyWidth,
                }}
              >
                {getEnemyEmoji(enemy.type)}
              </div>
            ))}

            {/* 총알 */}
            {gameState.bullets.map((bullet) => (
              <div
                key={bullet.id}
                className="absolute bg-yellow-400 rounded-full"
                style={{
                  left: bullet.x - GAME_CONFIG.bulletWidth / 2,
                  top: bullet.y,
                  width: GAME_CONFIG.bulletWidth,
                  height: GAME_CONFIG.bulletHeight,
                }}
              />
            ))}

            {/* 플레이어 */}
            <div
              className="absolute text-center"
              style={{
                left: gameState.playerX - GAME_CONFIG.playerWidth / 2,
                bottom: 10,
                width: GAME_CONFIG.playerWidth,
                height: GAME_CONFIG.playerHeight,
                fontSize: GAME_CONFIG.playerWidth,
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

        {/* 컨트롤 버튼 */}
        {!gameState.gameOver && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button
                variant={isPaused ? 'primary' : 'secondary'}
                onClick={() => setIsPaused(!isPaused)}
                fullWidth
              >
                {isPaused ? '▶️ 계속' : '⏸️ 일시정지'}
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
              <div className="flex items-center justify-center gap-4">
                <button
                  onTouchStart={() => keysPressed.current.add('ArrowLeft')}
                  onTouchEnd={() => keysPressed.current.delete('ArrowLeft')}
                  onMouseDown={() => keysPressed.current.add('ArrowLeft')}
                  onMouseUp={() => keysPressed.current.delete('ArrowLeft')}
                  className="bg-blue-500 text-white font-bold text-4xl w-20 h-20 rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-all shadow-lg"
                >
                  ←
                </button>
                <button
                  onClick={() => {
                    if (gameState.bullets.length < 3) {
                      setGameState((prev) => {
                        if (!prev) return prev;
                        return {
                          ...prev,
                          bullets: [...prev.bullets, createBullet(prev.playerX)],
                        };
                      });
                      soundManager.playClick();
                    }
                  }}
                  className="bg-red-500 text-white font-bold text-2xl w-20 h-20 rounded-full hover:bg-red-600 active:bg-red-700 transition-all shadow-lg"
                >
                  🔥
                </button>
                <button
                  onTouchStart={() => keysPressed.current.add('ArrowRight')}
                  onTouchEnd={() => keysPressed.current.delete('ArrowRight')}
                  onMouseDown={() => keysPressed.current.add('ArrowRight')}
                  onMouseUp={() => keysPressed.current.delete('ArrowRight')}
                  className="bg-blue-500 text-white font-bold text-4xl w-20 h-20 rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-all shadow-lg"
                >
                  →
                </button>
              </div>
              <div className="text-center text-sm text-white mt-2">
                발사: 🔥 버튼 / Space키
              </div>
            </div>
          </div>
        )}

        {/* 게임 오버 메시지 */}
        {gameState.gameOver && (
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
