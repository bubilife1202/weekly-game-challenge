import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { AdSense } from '../components/common/AdSense';
import { soundManager } from '../utils/sound';
import {
  createInitialState,
  movePlayer,
  jumpPlayer,
  updatePhysics,
  updateEnemies,
  checkCollisions,
  getPlayerEmoji,
  getEnemyEmoji,
  getPlatformColor,
  GAME_CONFIG,
  type GameState,
} from '../utils/mario';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

export const MarioGame = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const keysPressed = useRef<Set<string>>(new Set());
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameSize, setGameSize] = useState({ width: 800, height: 600 });
  const [isMobile, setIsMobile] = useState(false);

  // 조이스틱 상태 (모바일)
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickBase, setJoystickBase] = useState({ x: 0, y: 0 });
  const [joystickStick, setJoystickStick] = useState({ x: 0, y: 0 });
  const [currentDirection, setCurrentDirection] = useState<'left' | 'right' | null>(null);

  const { addRecord } = useGameStore();
  const { currentProfileId } = useProfileStore();

  // 모바일 감지 및 게임 크기 조정
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const mobile = screenWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        const maxWidth = screenWidth - 32;
        const maxHeight = screenHeight - 300;
        const scale = Math.min(maxWidth / 800, maxHeight / 600);
        setGameSize({
          width: 800 * scale,
          height: 600 * scale,
        });
      } else {
        setGameSize({ width: 800, height: 600 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    soundManager.playClick();
    const initialState = createInitialState();
    setGameState(initialState);
    setShowInstructions(false);
    setIsPaused(false);
  }, []);

  // 게임 루프
  useEffect(() => {
    if (!gameState || gameState.gameOver || gameState.won || isPaused) return;

    const gameLoop = setInterval(() => {
      setGameState((prevState) => {
        if (!prevState) return prevState;

        let newState = { ...prevState };

        // 플레이어 이동 (키보드 또는 조이스틱)
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a') || currentDirection === 'left') {
          newState = movePlayer(newState, 'left');
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d') || currentDirection === 'right') {
          newState = movePlayer(newState, 'right');
        }

        // 물리 업데이트
        newState = updatePhysics(newState);

        // 적 업데이트
        newState = updateEnemies(newState);

        // 충돌 감지
        newState = checkCollisions(newState);

        // 게임 완료 체크
        if ((newState.gameOver || newState.won) && !prevState.gameOver && !prevState.won) {
          soundManager.playComplete();

          // 게임 결과 저장
          if (currentProfileId) {
            addRecord({
              profileId: currentProfileId,
              gameType: 'memory', // TODO: 'mario' 타입 추가
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
  }, [gameState, isPaused, currentDirection, currentProfileId, addRecord]);

  // 키보드 컨트롤
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        if (!gameState || gameState.gameOver || gameState.won) return;
        if (isPaused) {
          setIsPaused(false);
        } else {
          setGameState((prev) => (prev ? jumpPlayer(prev) : prev));
          soundManager.playClick();
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

  // 터치 조이스틱 (모바일)
  useEffect(() => {
    if (!isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (!gameState || gameState.gameOver || gameState.won || isPaused) return;

      // 화면 왼쪽 절반 - 조이스틱
      const touch = e.touches[0];
      if (touch.clientX < window.innerWidth / 2) {
        e.preventDefault();
        setJoystickBase({ x: touch.clientX, y: touch.clientY });
        setJoystickStick({ x: touch.clientX, y: touch.clientY });
        setJoystickActive(true);
      }
      // 화면 오른쪽 절반 - 점프
      else {
        e.preventDefault();
        setGameState((prev) => (prev ? jumpPlayer(prev) : prev));
        soundManager.playClick();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!joystickActive) return;
      e.preventDefault();

      const touch = e.touches[0];
      const dx = touch.clientX - joystickBase.x;
      const distance = Math.abs(dx);

      if (distance > 15) {
        setCurrentDirection(dx > 0 ? 'right' : 'left');
      } else {
        setCurrentDirection(null);
      }

      setJoystickStick({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = () => {
      setJoystickActive(false);
      setCurrentDirection(null);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState, isPaused, joystickActive, joystickBase, isMobile]);

  // 시작 화면
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
        <Header title="🍄 슈퍼 점프맨" showBack />
        <div className="max-w-3xl mx-auto p-4 space-y-6 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center space-y-6">
            <div className="text-8xl animate-bounce">🚶‍♂️</div>
            <h2 className="text-3xl font-bold text-textDark">슈퍼 점프맨!</h2>
            <p className="text-gray-600">
              플랫폼을 따라 달려가며 적을 피하고 코인을 모으세요!
            </p>

            <div className="bg-blue-50 rounded-xl p-6 space-y-4 text-left">
              <h3 className="font-bold text-lg text-center text-blue-800">조작법</h3>

              {/* 데스크톱 조작 */}
              <div className="hidden md:block space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⬅️➡️</span>
                  <span className="text-gray-700">화살표 키 또는 A/D - 좌우 이동</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⬆️</span>
                  <span className="text-gray-700">위 화살표 또는 W/스페이스 - 점프</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⏸️</span>
                  <span className="text-gray-700">P - 일시정지</span>
                </div>
              </div>

              {/* 모바일 조작 */}
              <div className="block md:hidden space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🕹️</span>
                  <span className="text-gray-700">화면 왼쪽을 터치하여 좌우 이동</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👆</span>
                  <span className="text-gray-700">화면 오른쪽을 터치하여 점프</span>
                </div>
              </div>

              <div className="border-t-2 border-blue-200 pt-4 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🪙</span>
                  <span className="text-gray-700">코인 수집: +10점</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👾</span>
                  <span className="text-gray-700">적을 밟아서 제거: +20점</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏁</span>
                  <span className="text-gray-700">골에 도달: +100점</span>
                </div>
              </div>
            </div>

            <Button variant="primary" onClick={startGame} fullWidth>
              🎮 게임 시작
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 게임 오버 / 승리 화면
  if (gameState && (gameState.gameOver || gameState.won)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600">
        <Header title="🍄 슈퍼 점프맨" showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center space-y-6">
            <div className="text-8xl animate-bounce">
              {gameState.won ? '🎉' : '😢'}
            </div>
            <h2 className="text-3xl font-bold text-textDark">
              {gameState.won ? '클리어!' : '게임 오버'}
            </h2>

            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6">
              <div className="text-5xl font-bold text-white">{gameState.score}점</div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">수집한 코인</span>
                <span className="font-bold text-yellow-600">
                  🪙 {gameState.coins.filter((c) => c.collected).length}개
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">처치한 적</span>
                <span className="font-bold text-red-600">
                  👾 {gameState.enemies.filter((e) => !e.alive).length}마리
                </span>
              </div>
            </div>

            <AdSense className="my-4" />

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={startGame} fullWidth>
                🔄 다시 하기
              </Button>
              <Button variant="primary" onClick={() => window.location.href = '/'} fullWidth>
                🏠 홈으로
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 게임 플레이 화면
  if (!gameState) return null;

  const scale = gameSize.width / GAME_CONFIG.width;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 pb-20">
      <Header title="🍄 슈퍼 점프맨" showBack />

      <div className="max-w-5xl mx-auto p-4 space-y-4">
        {/* 게임 정보 */}
        <div className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="text-xl font-bold text-textDark">점수: {gameState.score}</div>
            <div className="text-xl">❤️ × {gameState.lives}</div>
          </div>
          <Button variant={isPaused ? 'primary' : 'secondary'} onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? '▶️ 계속' : '⏸️ 일시정지'}
          </Button>
        </div>

        {/* 게임 화면 */}
        <div
          ref={gameContainerRef}
          className="relative bg-gradient-to-b from-sky-400 to-sky-200 border-4 border-white rounded-xl overflow-hidden mx-auto shadow-2xl touch-none"
          style={{
            width: gameSize.width,
            height: gameSize.height,
          }}
        >
          {/* 플랫폼 */}
          {gameState.platforms.map((platform, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                left: (platform.x - gameState.cameraX) * scale,
                top: platform.y * scale,
                width: platform.width * scale,
                height: platform.height * scale,
                backgroundColor: getPlatformColor(platform.type),
                border: platform.type === 'question' ? '2px solid #FFA500' : 'none',
              }}
            />
          ))}

          {/* 코인 */}
          {gameState.coins
            .filter((coin) => !coin.collected)
            .map((coin, index) => (
              <div
                key={index}
                className="absolute text-2xl animate-pulse"
                style={{
                  left: (coin.x - gameState.cameraX - 10) * scale,
                  top: coin.y * scale,
                  fontSize: `${20 * scale}px`,
                }}
              >
                🪙
              </div>
            ))}

          {/* 적 */}
          {gameState.enemies
            .filter((enemy) => enemy.alive)
            .map((enemy, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  left: (enemy.x - gameState.cameraX) * scale,
                  top: enemy.y * scale,
                  fontSize: `${enemy.width * scale}px`,
                }}
              >
                {getEnemyEmoji(enemy.type)}
              </div>
            ))}

          {/* 플레이어 */}
          <div
            className="absolute transition-transform"
            style={{
              left: (gameState.player.x - gameState.cameraX) * scale,
              top: gameState.player.y * scale,
              fontSize: `${gameState.player.width * scale}px`,
            }}
          >
            {getPlayerEmoji(gameState.player)}
          </div>

          {/* 골 지점 */}
          <div
            className="absolute text-5xl"
            style={{
              left: (GAME_CONFIG.goalX - gameState.cameraX) * scale,
              top: 480 * scale,
            }}
          >
            🏁
          </div>

          {/* 일시정지 오버레이 */}
          {isPaused && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-8 text-center space-y-4">
                <div className="text-6xl">⏸️</div>
                <div className="text-2xl font-bold">일시정지</div>
                <Button variant="primary" onClick={() => setIsPaused(false)}>
                  계속하기
                </Button>
              </div>
            </div>
          )}

          {/* 조이스틱 표시 (모바일) */}
          {isMobile && joystickActive && (
            <>
              <div
                className="fixed w-20 h-20 bg-blue-300 bg-opacity-50 rounded-full border-4 border-blue-500"
                style={{
                  left: joystickBase.x - 40,
                  top: joystickBase.y - 40,
                }}
              />
              <div
                className="fixed w-12 h-12 bg-blue-600 rounded-full"
                style={{
                  left: joystickStick.x - 24,
                  top: joystickStick.y - 24,
                }}
              />
            </>
          )}
        </div>

        {/* 모바일 컨트롤 버튼 */}
        {isMobile && gameState && !gameState.gameOver && !gameState.won && !isPaused && (
          <div className="flex gap-3 mt-3">
            <Button
              onClick={() => {
                setGameState((prev) => (prev ? jumpPlayer(prev) : prev));
                soundManager.playClick();
              }}
              className="flex-1 py-6 text-2xl font-bold"
              disabled={!gameState.player.onGround}
            >
              ⬆️ 점프
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
