import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { AdSense } from '../components/common/AdSense';
import { soundManager } from '../utils/sound';
import {
  createInitialGrid,
  move,
  addRandomTile,
  canMove,
  copyGrid,
  getMaxTile,
  getTileColor,
  GRID_SIZES,
  type Grid,
  type Direction,
} from '../utils/game2048';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

type Difficulty = 'easy' | 'medium' | 'hard';

export const Game2048 = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [moves, setMoves] = useState(0);

  const { addRecord } = useGameStore();
  const { currentProfileId } = useProfileStore();

  // 게임 시작
  const startGame = useCallback((diff: Difficulty) => {
    soundManager.playClick();
    const size = GRID_SIZES[diff];
    setDifficulty(diff);
    setGrid(createInitialGrid(size));
    setScore(0);
    setGameOver(false);
    setMoves(0);
  }, []);

  // 이동 처리
  const handleMove = useCallback(
    (direction: Direction) => {
      if (!grid || gameOver) return;

      const result = move(grid, direction);

      if (result.moved) {
        const newGrid = copyGrid(result.grid);
        addRandomTile(newGrid);

        setGrid(newGrid);
        setScore((s) => {
          const newScore = s + result.score;
          if (newScore > bestScore) {
            setBestScore(newScore);
          }
          return newScore;
        });
        setMoves((m) => m + 1);

        if (result.score > 0) {
          soundManager.playMatch();
        } else {
          soundManager.playClick();
        }

        // 게임 오버 체크
        if (!canMove(newGrid)) {
          setGameOver(true);
          soundManager.playMismatch();

          // 게임 결과 저장
          if (currentProfileId && difficulty) {
            addRecord({
              profileId: currentProfileId,
              gameType: '2048',
              difficulty,
              score: score + result.score,
              time: moves + 1,
              completedAt: Date.now(),
            });
          }
        }
      }
    },
    [grid, gameOver, score, bestScore, moves, currentProfileId, difficulty, addRecord]
  );

  // 키보드 컨트롤
  useEffect(() => {
    if (!grid || gameOver) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'w':
        case 'ArrowUp':
          e.preventDefault();
          handleMove('up');
          break;
        case 's':
        case 'ArrowDown':
          e.preventDefault();
          handleMove('down');
          break;
        case 'a':
        case 'ArrowLeft':
          e.preventDefault();
          handleMove('left');
          break;
        case 'd':
        case 'ArrowRight':
          e.preventDefault();
          handleMove('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [grid, gameOver, handleMove]);

  // 터치 스와이프 컨트롤
  useEffect(() => {
    if (!grid || gameOver) return;

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

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipe) {
          handleMove(deltaX > 0 ? 'right' : 'left');
        }
      } else {
        if (Math.abs(deltaY) > minSwipe) {
          handleMove(deltaY > 0 ? 'down' : 'up');
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [grid, gameOver, handleMove]);

  // 난이도 선택 화면
  if (!difficulty || !grid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
        <Header title="🔢 2048" showBack />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-8xl">🔢</div>
            <h2 className="text-3xl font-bold text-textDark">2048</h2>
            <p className="text-gray-600">
              같은 숫자를 합쳐서 2048을 만드세요!
              <br />
              더 이상 움직일 수 없으면 게임 오버!
            </p>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mt-4">
              <div className="font-bold text-yellow-900 mb-2">📖 게임 방법:</div>
              <ul className="text-sm text-yellow-800 text-left space-y-1 ml-4">
                <li>• 2 + 2 = 4, 4 + 4 = 8 같이 합쳐집니다</li>
                <li>• 방향키나 스와이프로 타일을 밀어주세요</li>
                <li>• 모든 타일이 같은 방향으로 이동합니다</li>
                <li>• 새로운 타일(2 또는 4)이 계속 생성돼요</li>
                <li>• 2048 타일을 만들면 승리!</li>
              </ul>
            </div>
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
                  <div className="text-sm text-gray-600">클래식 모드</div>
                  <div className="text-xs text-gray-500 mt-1">4×4 그리드</div>
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
                  <div className="text-sm text-gray-600">더 큰 보드</div>
                  <div className="text-xs text-gray-500 mt-1">5×5 그리드</div>
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
                  <div className="text-sm text-gray-600">거대한 보드!</div>
                  <div className="text-xs text-gray-500 mt-1">6×6 그리드</div>
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
              <li>• 같은 숫자를 합치세요!</li>
              <li>• 목표: 2048 타일 만들기</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 게임 화면
  const gridSize = GRID_SIZES[difficulty];
  const cellSize = Math.min(400 / gridSize, 100);
  const maxTile = getMaxTile(grid);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 pb-6">
      <Header
        title="🔢 2048"
        showBack
        rightElement={
          <button
            onClick={() => {
              setDifficulty(null);
              setGrid(null);
            }}
            className="text-sm font-bold text-primary hover:text-primary/80 active:scale-95"
          >
            새 게임
          </button>
        }
      />

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 점수 표시 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-primary">{score}</div>
            <div className="text-xs text-gray-600">점수</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-yellow-600">{maxTile}</div>
            <div className="text-xs text-gray-600">최고 타일</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
            <div className="text-xs text-gray-600">이동</div>
          </div>
        </div>

        {/* 게임 보드 */}
        <div className="bg-white rounded-xl p-4 shadow-lg flex justify-center items-center">
          <div
            className="bg-gray-300 rounded-lg p-2 gap-2 grid"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`rounded-lg flex items-center justify-center font-bold transition-all duration-150 ${getTileColor(
                    cell
                  )}`}
                  style={{
                    fontSize: cell && cell >= 1024 ? cellSize * 0.3 : cellSize * 0.4,
                  }}
                >
                  {cell || ''}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 모바일 컨트롤 */}
        {!gameOver && (
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => handleMove('up')}
                className="bg-blue-500 text-white font-bold text-4xl w-20 h-20 rounded-xl hover:bg-blue-600 active:scale-95 active:bg-blue-700 transition-all shadow-lg touch-manipulation"
              >
                ↑
              </button>
              <div className="flex gap-4">
                <button
                  onClick={() => handleMove('left')}
                  className="bg-blue-500 text-white font-bold text-4xl w-20 h-20 rounded-xl hover:bg-blue-600 active:scale-95 active:bg-blue-700 transition-all shadow-lg touch-manipulation"
                >
                  ←
                </button>
                <button
                  onClick={() => handleMove('down')}
                  className="bg-blue-500 text-white font-bold text-4xl w-20 h-20 rounded-xl hover:bg-blue-600 active:scale-95 active:bg-blue-700 transition-all shadow-lg touch-manipulation"
                >
                  ↓
                </button>
                <button
                  onClick={() => handleMove('right')}
                  className="bg-blue-500 text-white font-bold text-4xl w-20 h-20 rounded-xl hover:bg-blue-600 active:scale-95 active:bg-blue-700 transition-all shadow-lg touch-manipulation"
                >
                  →
                </button>
              </div>
            </div>
            <div className="text-center text-sm text-gray-600 mt-4">
              💡 스와이프 또는 키보드 사용
            </div>
          </div>
        )}

        {/* 게임 오버 메시지 */}
        {gameOver && (
          <>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-4 border-red-400 rounded-2xl p-6 shadow-xl text-center space-y-4 animate-bounce-in">
              <div className="text-6xl">😢</div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-textDark">Game Over!</h2>
                <div className="text-lg text-gray-700">
                  <div>점수: {score}</div>
                  <div>최고 타일: {maxTile}</div>
                  <div>이동: {moves}회</div>
                  {maxTile >= 2048 && (
                    <div className="mt-2 text-2xl font-bold text-yellow-600">
                      🎉 2048 달성! 축하합니다!
                    </div>
                  )}
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
                    setGrid(null);
                  }}
                  fullWidth
                >
                  📋 난이도 선택
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
