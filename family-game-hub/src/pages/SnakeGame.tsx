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

type Difficulty = 'easy' | 'medium' | 'hard';

export const SnakeGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameState, setGameState] = useState<SnakeState | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const directionQueueRef = useRef<Direction[]>([]);

  const { addRecord } = useGameStore();
  const { currentProfileId } = useProfileStore();

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
    directionQueueRef.current = [];
  }, []);

  // 게임 루프
  useEffect(() => {
    if (!gameState || !difficulty || gameState.gameOver || isPaused) return;

    const speed = GAME_SPEEDS[difficulty];
    const interval = setInterval(() => {
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
    }, speed);

    return () => clearInterval(interval);
  }, [gameState, difficulty, isPaused, currentProfileId, addRecord, timer]);

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

  // 터치 스와이프 컨트롤
  useEffect(() => {
    if (!gameState || gameState.gameOver) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipe = 30;

      let newDirection: Direction | null = null;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipe) {
          newDirection = deltaX > 0 ? 'RIGHT' : 'LEFT';
        }
      } else {
        if (Math.abs(deltaY) > minSwipe) {
          newDirection = deltaY > 0 ? 'DOWN' : 'UP';
        }
      }

      if (newDirection && directionQueueRef.current.length < 3) {
        directionQueueRef.current.push(newDirection);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameState]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 난이도 선택 화면
  if (!difficulty || !gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Header title="🐍 Snake 게임" showBack />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
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
              <li>• 키보드: WASD 또는 화살표 키</li>
              <li>• 모바일: 스와이프</li>
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
            className="relative bg-gray-100 border-4 border-gray-800 rounded-lg"
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
          <div className="flex gap-3">
            <Button
              variant={isPaused ? 'primary' : 'secondary'}
              onClick={() => setIsPaused(!isPaused)}
              fullWidth
            >
              {isPaused ? '▶️ 계속' : '⏸️ 일시정지'}
            </Button>
          </div>
        )}

        {/* 게임 오버 메시지 */}
        {gameState.gameOver && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-4 border-red-400 rounded-2xl p-6 shadow-xl text-center space-y-4 animate-bounce-in">
            <div className="text-6xl">💀</div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-textDark">Game Over!</h2>
              <div className="text-lg text-gray-700">
                <div>점수: {gameState.score}</div>
                <div>길이: {gameState.snake.length}</div>
                <div>시간: {formatTime(timer)}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => startGame(difficulty)}
                fullWidth
              >
                🔄 다시 하기
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setDifficulty(null);
                  setGameState(null);
                }}
                fullWidth
              >
                📋 난이도 선택
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
