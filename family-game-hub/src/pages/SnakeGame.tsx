import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { soundManager } from '../utils/sound';
import {
  createInitialState,
  moveSnake,
  changeDirection,
  GAME_SPEEDS,
  GRID_SIZES,
  type SnakeState,
  type Direction,
} from '../utils/snake';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { useSettingsStore } from '../store/settingsStore';
import { QuickRulesCard } from '../components/common/QuickRulesCard';
import { SEO } from '../components/common/SEO';
import { GameOverModal } from '../components/common/GameOverModal';

type Difficulty = 'easy' | 'medium' | 'hard';

export const SnakeGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameState, setGameState] = useState<SnakeState | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const directionQueueRef = useRef<Direction[]>([]);
  const lastFrameRef = useRef<number | null>(null);

  // 조이스틱 상태
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickBase, setJoystickBase] = useState({ x: 0, y: 0 });
  const [joystickStick, setJoystickStick] = useState({ x: 0, y: 0 });
  const [currentDirection, setCurrentDirection] = useState<Direction | null>(null);

  const { addRecord } = useGameStore();
  const { currentProfileId } = useProfileStore();
  const { targetFps, lowPerformanceMode, setTargetFps, toggleLowPerformanceMode } =
    useSettingsStore();

  // 타이머
  useEffect(() => {
    if (!gameState || gameState.gameOver || isPaused) return;

    const interval = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, isPaused]);

  // 게임 시작
  const startGame = useCallback((diff: Difficulty) => {
    soundManager.playClick();
    const gridSize = GRID_SIZES[diff];
    setDifficulty(diff);
    setGameState(createInitialState(gridSize));
    setTimer(0);
    setIsPaused(false);
    setPlayCount((count) => count + 1);
    directionQueueRef.current = [];
    lastFrameRef.current = null;
  }, []);

  useEffect(() => {
    if (isPaused) {
      lastFrameRef.current = null;
    }
  }, [isPaused]);

  // 게임 루프
  useEffect(() => {
    if (!gameState || !difficulty || gameState.gameOver || isPaused) return;

    const tickInterval =
      GAME_SPEEDS[difficulty] * (60 / targetFps) * (lowPerformanceMode ? 1.25 : 1);

    const loop = (time: number) => {
      if (!lastFrameRef.current) {
        lastFrameRef.current = time;
      }

      const delta = time - lastFrameRef.current;
      if (delta >= tickInterval) {
        lastFrameRef.current = time;

        setGameState((prevState) => {
          if (!prevState) return prevState;

          // 큐에서 방향 꺼내기
          let newDirection = prevState.direction;
          if (directionQueueRef.current.length > 0) {
            newDirection = changeDirection(
              prevState.direction,
              directionQueueRef.current.shift()!
            );
          }

          const newState = moveSnake(
            { ...prevState, direction: newDirection },
            GRID_SIZES[difficulty]
          );

          // 게임 오버 체크
          if (newState.gameOver && !prevState.gameOver) {
            soundManager.playMismatch();
            // 게임 결과 저장
            if (currentProfileId) {
              addRecord({
                profileId: currentProfileId,
                gameType: 'snake',
                difficulty,
                time: timer,
                score: newState.score,
                completedAt: Date.now(),
              });
            }
          } else if (newState.score > prevState.score) {
            // 음식 먹음
            soundManager.playMatch();
          }

          return newState;
        });
      }

      requestAnimationFrame(loop);
    };

    const frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState, difficulty, isPaused, currentProfileId, addRecord, timer, targetFps, lowPerformanceMode]);

  // 키보드 컨트롤
  useEffect(() => {
    if (!gameState || gameState.gameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault();

      if (e.key === ' ') {
        setIsPaused((p) => !p);
        return;
      }

      let newDirection: Direction | null = null;

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newDirection = 'UP';
          break;
        case 's':
        case 'arrowdown':
          newDirection = 'DOWN';
          break;
        case 'a':
        case 'arrowleft':
          newDirection = 'LEFT';
          break;
        case 'd':
        case 'arrowright':
          newDirection = 'RIGHT';
          break;
      }

      if (newDirection && directionQueueRef.current.length < 3) {
        directionQueueRef.current.push(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]);

  // 조이스틱 컨트롤
  useEffect(() => {
    if (!gameState || gameState.gameOver || isPaused) return;

    const joystickRadius = 60; // 조이스틱 반경
    const deadZone = 15; // 중앙 데드존

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      // 조이스틱 베이스를 터치 시작 위치에 배치
      setJoystickBase({ x: touch.clientX, y: touch.clientY });
      setJoystickStick({ x: touch.clientX, y: touch.clientY });
      setJoystickActive(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!joystickActive) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - joystickBase.x;
      const deltaY = touch.clientY - joystickBase.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // 데드존 체크
      if (distance < deadZone) {
        setCurrentDirection(null);
        setJoystickStick({ x: joystickBase.x, y: joystickBase.y });
        return;
      }

      // 스틱 위치 제한 (조이스틱 반경 내)
      let stickX = touch.clientX;
      let stickY = touch.clientY;
      if (distance > joystickRadius) {
        const angle = Math.atan2(deltaY, deltaX);
        stickX = joystickBase.x + Math.cos(angle) * joystickRadius;
        stickY = joystickBase.y + Math.sin(angle) * joystickRadius;
      }
      setJoystickStick({ x: stickX, y: stickY });

      // 방향 결정 (4방향)
      const angle = Math.atan2(deltaY, deltaX);
      const degrees = (angle * 180) / Math.PI;

      let direction: Direction;
      if (degrees >= -45 && degrees < 45) {
        direction = 'RIGHT';
      } else if (degrees >= 45 && degrees < 135) {
        direction = 'DOWN';
      } else if (degrees >= -135 && degrees < -45) {
        direction = 'UP';
      } else {
        direction = 'LEFT';
      }

      setCurrentDirection(direction);
    };

    const handleTouchEnd = () => {
      setJoystickActive(false);
      setCurrentDirection(null);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [joystickActive, joystickBase, gameState, isPaused]);

  // 조이스틱 방향에 따라 방향 큐에 추가
  useEffect(() => {
    if (!currentDirection || !gameState || gameState.gameOver || isPaused) return;

    // 조이스틱 방향을 방향 큐에 추가
    if (directionQueueRef.current.length < 3) {
      const lastDirection = directionQueueRef.current[directionQueueRef.current.length - 1] || gameState.direction;
      // 같은 방향이 아니면 추가
      if (currentDirection !== lastDirection) {
        directionQueueRef.current.push(currentDirection);
      }
    }
  }, [currentDirection, gameState, isPaused]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 난이도 선택 화면
  if (!difficulty || !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <SEO
          title="Snake 게임 - 세계 1위 도전!"
          description="초고속 반응속도 테스트! 뱀 게임에서 1등에 도전하세요."
          url="/snake"
        />
        <Header title="🐍 Snake 게임" showBack />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <QuickRulesCard
            title="15초 안에 규칙 훑기"
            subtitle="두 판까지만 자동으로 열려요"
            playCount={playCount}
            rules={['음식을 먹을 때마다 길이가 늘어나요.', '몸이나 벽에 닿으면 즉시 게임 오버!', '연속 3판 달성 시 보너스 점수와 스킨 획득 기회!']}
            tips={[
              '방향을 미리 입력해 회전을 부드럽게 이어보세요.',
              '저성능 모드로 배터리/발열을 줄일 수 있어요.',
            ]}
            accentEmoji="🐍"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 shadow flex items-center justify-between gap-2">
              <div>
                <div className="text-xs text-gray-500">목표 프레임</div>
                <div className="font-bold text-textDark">{targetFps} fps</div>
              </div>
              <Button
                size="small"
                variant="secondary"
                animated
                onClick={() => setTargetFps(targetFps === 60 ? 48 : 60)}
              >
                {targetFps === 60 ? '절전 48fps' : '60fps로'}
              </Button>
            </div>

            <div className="bg-white rounded-xl p-3 shadow flex items-center justify-between gap-2">
              <div>
                <div className="text-xs text-gray-500">저성능 모드</div>
                <div className="font-bold text-textDark">{lowPerformanceMode ? 'ON - 부드럽게' : 'OFF - 선명하게'}</div>
              </div>
              <Button
                size="small"
                variant={lowPerformanceMode ? 'secondary' : 'primary'}
                animated
                onClick={toggleLowPerformanceMode}
              >
                {lowPerformanceMode ? '해제' : '켜기'}
              </Button>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="text-8xl">🐍</div>
            <h2 className="text-3xl font-bold text-textDark">Snake 게임</h2>
            <p className="text-gray-600">
              뱀을 조종해서 음식을 먹으세요!
              <br />
              자기 몸이나 벽에 부딪히면 게임 오버!
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-textDark text-center">
              난이도를 선택하세요
            </h3>

            <button
              onClick={() => startGame('easy')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    🌟 쉬움
                  </div>
                  <div className="text-sm text-gray-600">느린 속도</div>
                  <div className="text-xs text-gray-500 mt-1">15×15 그리드</div>
                </div>
                <div className="text-4xl">→</div>
              </div>
            </button>

            <button
              onClick={() => startGame('medium')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    ⭐ 보통
                  </div>
                  <div className="text-sm text-gray-600">중간 속도</div>
                  <div className="text-xs text-gray-500 mt-1">20×20 그리드</div>
                </div>
                <div className="text-4xl">→</div>
              </div>
            </button>

            <button
              onClick={() => startGame('hard')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    ✨ 어려움
                  </div>
                  <div className="text-sm text-gray-600">빠른 속도!</div>
                  <div className="text-xs text-gray-500 mt-1">25×25 그리드</div>
                </div>
                <div className="text-4xl">→</div>
              </div>
            </button>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
            <div className="font-bold text-blue-900">🎮 조작법:</div>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>• 🕹️ 모바일: 화면 터치 후 드래그!</li>
              <li>• ⌨️ 키보드: WASD 또는 화살표 키</li>
              <li>• Space: 일시정지</li>
              <li>• 🍎 = 음식 (10점)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 게임 화면
  const gridSize = GRID_SIZES[difficulty];
  const cellSize = Math.min(500 / gridSize, 25);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pb-6">
      <SEO
        title={`Snake 게임 - 점수: ${gameState.score}`}
        url="/snake"
      />
      <Header
        title="🐍 Snake"
        showBack
        rightElement={
          <button
            onClick={() => {
              setDifficulty(null);
              setGameState(null);
            }}
            className="text-sm font-bold text-primary hover:text-primary/80 active:scale-95"
          >
            새 게임
          </button>
        }
      />

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <QuickRulesCard
          title="빠른 규칙 카드"
          subtitle="15초 후 자동 축소"
          playCount={playCount}
          rules={['화면을 스와이프하거나 방향키로 뱀을 조종하세요.', '음식을 먹으면 점수와 길이가 증가합니다.', '연속 3판째마다 보너스 점수와 전용 스킨을 노려보세요.']}
          tips={[
            '저성능 모드에서는 틱이 느려져 배터리를 아낄 수 있어요.',
            `${targetFps}fps 목표를 유지하며 움직임이 안정화돼요.`,
          ]}
          accentEmoji="⚡"
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 shadow flex items-center justify-between gap-2">
            <div>
              <div className="text-xs text-gray-500">목표 프레임</div>
              <div className="font-bold text-textDark">{targetFps} fps</div>
            </div>
            <Button
              size="small"
              variant="secondary"
              animated
              onClick={() => setTargetFps(targetFps === 60 ? 48 : 60)}
            >
              {targetFps === 60 ? '절전 48fps' : '60fps로'}
            </Button>
          </div>

          <div className="bg-white rounded-xl p-3 shadow flex items-center justify-between gap-2">
            <div>
              <div className="text-xs text-gray-500">저성능 모드</div>
              <div className="font-bold text-textDark">{lowPerformanceMode ? 'ON' : 'OFF'}</div>
            </div>
            <Button
              size="small"
              variant={lowPerformanceMode ? 'secondary' : 'primary'}
              animated
              onClick={toggleLowPerformanceMode}
            >
              {lowPerformanceMode ? '해제' : '켜기'}
            </Button>
          </div>
        </div>

        {/* 상태 표시 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{gameState.score}</div>
              <div className="text-xs text-gray-600">점수</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {gameState.snake.length}
              </div>
              <div className="text-xs text-gray-600">길이</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{formatTime(timer)}</div>
              <div className="text-xs text-gray-600">시간</div>
            </div>
          </div>
        </div>

        {/* 게임 보드 */}
        <div className="bg-white rounded-xl p-4 shadow-lg flex justify-center items-center">
          <div
            className="relative bg-gray-100 border-4 border-gray-800 rounded-lg touch-none"
            style={{
              width: cellSize * gridSize,
              height: cellSize * gridSize,
            }}
          >
            {/* 뱀 */}
            {gameState.snake.map((segment, index) => (
              <div
                key={index}
                className={`absolute ${
                  index === 0 ? 'bg-green-600' : 'bg-green-500'
                } rounded-sm`}
                style={{
                  left: segment.x * cellSize,
                  top: segment.y * cellSize,
                  width: cellSize - 2,
                  height: cellSize - 2,
                  transition: 'all 0.05s linear',
                }}
              />
            ))}

            {/* 음식 */}
            <div
              className="absolute text-center flex items-center justify-center"
              style={{
                left: gameState.food.x * cellSize,
                top: gameState.food.y * cellSize,
                width: cellSize,
                height: cellSize,
                fontSize: cellSize * 0.8,
              }}
            >
              🍎
            </div>

            {/* 일시정지 오버레이 */}
            {isPaused && !gameState.gameOver && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-white text-4xl font-bold">일시정지</div>
              </div>
            )}
          </div>
        </div>

        {/* 컨트롤 버튼 */}
        {!gameState.gameOver && (
          <>
            <div className="flex gap-3">
              <Button
                variant={isPaused ? 'primary' : 'secondary'}
                onClick={() => setIsPaused(!isPaused)}
                fullWidth
                animated
              >
                {isPaused ? '▶️ 계속' : '⏸️ 일시정지'}
              </Button>
            </div>

            {/* 모바일 조이스틱 안내 */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-center md:hidden">
              <div className="text-sm text-blue-800">
                🕹️ <span className="font-bold">화면을 터치하고 드래그</span>하여 방향 조작
              </div>
            </div>
          </>
        )}

        {/* 가상 조이스틱 */}
        {joystickActive && !gameState.gameOver && (
          <>
            {/* 조이스틱 베이스 */}
            <div
              className="fixed pointer-events-none z-50"
              style={{
                left: joystickBase.x - 60,
                top: joystickBase.y - 60,
                width: 120,
                height: 120,
              }}
            >
              <div className="w-full h-full rounded-full bg-gray-800/20 border-4 border-gray-600/40 flex items-center justify-center">
                {/* 방향 표시 */}
                <div className="text-gray-600/60 font-bold text-sm">
                  {currentDirection === 'UP' && '↑'}
                  {currentDirection === 'DOWN' && '↓'}
                  {currentDirection === 'LEFT' && '←'}
                  {currentDirection === 'RIGHT' && '→'}
                </div>
              </div>
            </div>
            {/* 조이스틱 스틱 */}
            <div
              className="fixed pointer-events-none z-50"
              style={{
                left: joystickStick.x - 30,
                top: joystickStick.y - 30,
                width: 60,
                height: 60,
              }}
            >
              <div className="w-full h-full rounded-full bg-green-500/80 border-4 border-green-600 shadow-lg" />
            </div>
          </>
        )}

        {/* 게임 오버 모달 */}
        <GameOverModal
          isOpen={gameState.gameOver}
          score={gameState.score}
          gameName="Snake"
          onRestart={() => startGame(difficulty)}
          onHome={() => {
            setDifficulty(null);
            setGameState(null);
          }}
          additionalInfo={
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <span className="block text-xs text-gray-400">길이</span>
                <span className="font-bold text-gray-700">{gameState.snake.length}</span>
              </div>
              <div>
                <span className="block text-xs text-gray-400">생존 시간</span>
                <span className="font-bold text-gray-700">{formatTime(timer)}</span>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};
