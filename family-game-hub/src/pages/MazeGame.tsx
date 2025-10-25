import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { soundManager } from '../utils/sound';
import {
  generateMaze,
  canMove,
  getNextPosition,
  MAZE_SIZES,
  type MazeGrid,
  type Position,
} from '../utils/maze';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

type Difficulty = 'easy' | 'medium' | 'hard';

export const MazeGame = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [maze, setMaze] = useState<MazeGrid | null>(null);
  const [playerPos, setPlayerPos] = useState<Position>({ row: 0, col: 0 });
  const [collectedStars, setCollectedStars] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);

  const { addRecord } = useGameStore();
  const { currentProfileId } = useProfileStore();

  // 타이머
  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && !isComplete) {
      interval = window.setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isComplete]);

  // 새 게임 시작
  const startNewGame = useCallback((diff: Difficulty) => {
    soundManager.playClick();
    const size = MAZE_SIZES[diff];
    const newMaze = generateMaze(size.rows, size.cols);

    // 전체 별 개수 계산
    let starCount = 0;
    for (let row = 0; row < size.rows; row++) {
      for (let col = 0; col < size.cols; col++) {
        if (newMaze[row][col].hasStar) {
          starCount++;
        }
      }
    }

    setDifficulty(diff);
    setMaze(newMaze);
    setPlayerPos({ row: 0, col: 0 });
    setCollectedStars(0);
    setTotalStars(starCount);
    setTimer(0);
    setIsRunning(true);
    setIsComplete(false);
    setMoves(0);
  }, []);

  // 플레이어 이동
  const movePlayer = useCallback(
    (direction: 'up' | 'down' | 'left' | 'right') => {
      if (!maze || !difficulty || isComplete) return;

      const size = MAZE_SIZES[difficulty];

      // 벽이 있는지 확인
      if (!canMove(maze, playerPos, direction)) {
        soundManager.playMismatch();
        return;
      }

      // 다음 위치 계산
      const nextPos = getNextPosition(playerPos, direction, size.rows, size.cols);
      if (!nextPos) return;

      soundManager.playClick();
      setPlayerPos(nextPos);
      setMoves((m) => m + 1);

      // 별 수집 확인
      if (maze[nextPos.row][nextPos.col].hasStar) {
        maze[nextPos.row][nextPos.col].hasStar = false;
        setCollectedStars((s) => s + 1);
        soundManager.playMatch();
      }

      // 골인 지점 도착 확인
      if (nextPos.row === size.rows - 1 && nextPos.col === size.cols - 1) {
        setIsComplete(true);
        setIsRunning(false);
        soundManager.playComplete();

        // 게임 결과 저장
        if (currentProfileId) {
          addRecord({
            profileId: currentProfileId,
            gameType: 'maze',
            difficulty,
            time: timer,
            score: Math.max(
              1000 + collectedStars * 50 - timer - moves,
              100
            ),
            completedAt: Date.now(),
          });
        }
      }
    },
    [maze, playerPos, difficulty, isComplete, currentProfileId, timer, moves, collectedStars, addRecord]
  );

  // 키보드 컨트롤
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isRunning || isComplete) return;

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          movePlayer('up');
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          movePlayer('down');
          break;
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          movePlayer('left');
          break;
        case 'd':
        case 'arrowright':
          e.preventDefault();
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer, isRunning, isComplete]);

  // 타이머 포맷
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 난이도 선택 화면
  if (!difficulty || !maze) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header title="🌟 미로 찾기" showBack />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-8xl">🌟</div>
            <h2 className="text-3xl font-bold text-textDark">미로 찾기</h2>
            <p className="text-gray-600">
              골인 지점까지 길을 찾아가세요!
              <br />
              ⭐ 별을 많이 모을수록 높은 점수!
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-textDark text-center">
              난이도를 선택하세요
            </h3>

            <button
              onClick={() => startNewGame('easy')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    🌟 쉬움
                  </div>
                  <div className="text-sm text-gray-600">작은 미로</div>
                  <div className="text-xs text-gray-500 mt-1">8×8 미로</div>
                </div>
                <div className="text-4xl">→</div>
              </div>
            </button>

            <button
              onClick={() => startNewGame('medium')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold text-yellow-600 mb-2">
                    ⭐ 보통
                  </div>
                  <div className="text-sm text-gray-600">중간 크기 미로</div>
                  <div className="text-xs text-gray-500 mt-1">12×12 미로</div>
                </div>
                <div className="text-4xl">→</div>
              </div>
            </button>

            <button
              onClick={() => startNewGame('hard')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    ✨ 어려움
                  </div>
                  <div className="text-sm text-gray-600">큰 미로</div>
                  <div className="text-xs text-gray-500 mt-1">16×16 미로</div>
                </div>
                <div className="text-4xl">→</div>
              </div>
            </button>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
            <div className="font-bold text-blue-900">🎮 조작법:</div>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>• 키보드: WASD 또는 화살표 키</li>
              <li>• 터치: 화면 하단 버튼</li>
              <li>• 🚩 빨간색 = 골인 지점</li>
              <li>• ⭐ 별을 많이 모으세요!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 게임 화면
  const size = MAZE_SIZES[difficulty];
  const cellSize = Math.min(400 / size.cols, 400 / size.rows);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-6">
      <Header
        title="🌟 미로 찾기"
        showBack
        rightElement={
          <button
            onClick={() => {
              setDifficulty(null);
              setMaze(null);
              setIsRunning(false);
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
              <div className="text-2xl font-bold text-primary">{formatTime(timer)}</div>
              <div className="text-xs text-gray-600">시간</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {collectedStars}/{totalStars}
              </div>
              <div className="text-xs text-gray-600">별</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{moves}</div>
              <div className="text-xs text-gray-600">이동</div>
            </div>
          </div>
        </div>

        {/* 미로 */}
        <div className="bg-white rounded-xl p-4 shadow-lg flex justify-center items-center overflow-auto">
          <div
            className="relative bg-gray-800"
            style={{
              width: cellSize * size.cols,
              height: cellSize * size.rows,
            }}
          >
            {maze.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isPlayer = playerPos.row === rowIndex && playerPos.col === colIndex;
                const isGoal =
                  rowIndex === size.rows - 1 && colIndex === size.cols - 1;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="absolute bg-white"
                    style={{
                      left: colIndex * cellSize,
                      top: rowIndex * cellSize,
                      width: cellSize,
                      height: cellSize,
                      borderTop: cell.walls.top ? '2px solid #1f2937' : 'none',
                      borderRight: cell.walls.right ? '2px solid #1f2937' : 'none',
                      borderBottom: cell.walls.bottom ? '2px solid #1f2937' : 'none',
                      borderLeft: cell.walls.left ? '2px solid #1f2937' : 'none',
                    }}
                  >
                    {/* 내용 */}
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      {isPlayer && '🧑'}
                      {!isPlayer && isGoal && '🚩'}
                      {!isPlayer && !isGoal && cell.hasStar && '⭐'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 컨트롤 */}
        {!isComplete && (
          <div className="bg-white rounded-xl p-4 shadow-md">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => movePlayer('up')}
                className="bg-blue-500 text-white font-bold text-2xl w-16 h-16 rounded-lg hover:bg-blue-600 active:scale-95 transition-all shadow-md"
              >
                ↑
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => movePlayer('left')}
                  className="bg-blue-500 text-white font-bold text-2xl w-16 h-16 rounded-lg hover:bg-blue-600 active:scale-95 transition-all shadow-md"
                >
                  ←
                </button>
                <button
                  onClick={() => movePlayer('down')}
                  className="bg-blue-500 text-white font-bold text-2xl w-16 h-16 rounded-lg hover:bg-blue-600 active:scale-95 transition-all shadow-md"
                >
                  ↓
                </button>
                <button
                  onClick={() => movePlayer('right')}
                  className="bg-blue-500 text-white font-bold text-2xl w-16 h-16 rounded-lg hover:bg-blue-600 active:scale-95 transition-all shadow-md"
                >
                  →
                </button>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-2">
              키보드: WASD 또는 화살표 키
            </div>
          </div>
        )}

        {/* 완료 메시지 */}
        {isComplete && (
          <div className="bg-gradient-to-r from-yellow-50 to-green-50 border-4 border-yellow-400 rounded-2xl p-6 shadow-xl text-center space-y-4 animate-bounce-in">
            <div className="text-6xl">🎉</div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-textDark">골인!</h2>
              <div className="text-lg text-gray-700">
                <div>시간: {formatTime(timer)}</div>
                <div>이동: {moves}회</div>
                <div>별: {collectedStars}/{totalStars}</div>
                <div className="mt-2 text-2xl font-bold text-primary">
                  점수: {Math.max(1000 + collectedStars * 50 - timer - moves, 100)}점
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => startNewGame(difficulty)}
                fullWidth
              >
                🔄 같은 난이도
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setDifficulty(null);
                  setMaze(null);
                  setIsRunning(false);
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
