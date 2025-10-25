import { useState, useEffect, useCallback } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { soundManager } from '../utils/sound';
import {
  createPuzzle,
  isValidPlacement,
  isPuzzleComplete,
  isGridValid,
  findEmptyCell,
  solveSudoku,
  copyGrid,
  type SudokuGrid,
} from '../utils/sudoku';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

type Difficulty = 'easy' | 'medium' | 'hard';

export const Sudoku = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [initialGrid, setInitialGrid] = useState<SudokuGrid | null>(null);
  const [currentGrid, setCurrentGrid] = useState<SudokuGrid | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showError, setShowError] = useState(false);

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
    const puzzle = createPuzzle(diff);
    setDifficulty(diff);
    setInitialGrid(copyGrid(puzzle));
    setCurrentGrid(copyGrid(puzzle));
    setSelectedCell(null);
    setTimer(0);
    setIsRunning(true);
    setMistakes(0);
    setIsComplete(false);
    setHintsUsed(0);
    setShowError(false);
  }, []);

  // 숫자 입력
  const handleNumberInput = useCallback(
    (num: number) => {
      if (!selectedCell || !currentGrid || !initialGrid || isComplete) return;

      const [row, col] = selectedCell;

      // 고정된 셀인지 확인
      if (initialGrid[row][col] !== null) {
        soundManager.playMismatch();
        return;
      }

      const newGrid = copyGrid(currentGrid);
      newGrid[row][col] = num;

      // 유효한 배치인지 확인
      if (!isValidPlacement(newGrid, row, col, num)) {
        setMistakes((m) => m + 1);
        soundManager.playMismatch();
        setShowError(true);
        setTimeout(() => setShowError(false), 500);
        return;
      }

      soundManager.playMatch();
      setCurrentGrid(newGrid);

      // 완성 확인
      if (isPuzzleComplete(newGrid) && isGridValid(newGrid)) {
        setIsComplete(true);
        setIsRunning(false);
        soundManager.playComplete();

        // 게임 결과 저장
        if (currentProfileId && difficulty) {
          addRecord({
            profileId: currentProfileId,
            gameType: 'sudoku',
            difficulty,
            time: timer,
            score: Math.max(1000 - mistakes * 50 - hintsUsed * 20 - timer, 100),
            completedAt: Date.now(),
          });
        }
      }
    },
    [selectedCell, currentGrid, initialGrid, isComplete, currentProfileId, difficulty, timer, mistakes, hintsUsed, addRecord]
  );

  // 셀 지우기
  const handleClear = useCallback(() => {
    if (!selectedCell || !currentGrid || !initialGrid || isComplete) return;

    const [row, col] = selectedCell;

    // 고정된 셀인지 확인
    if (initialGrid[row][col] !== null) {
      soundManager.playMismatch();
      return;
    }

    const newGrid = copyGrid(currentGrid);
    newGrid[row][col] = null;
    setCurrentGrid(newGrid);
    soundManager.playClick();
  }, [selectedCell, currentGrid, initialGrid, isComplete]);

  // 힌트
  const handleHint = useCallback(() => {
    if (!currentGrid || !initialGrid || isComplete) return;

    const emptyCell = findEmptyCell(currentGrid);
    if (!emptyCell) return;

    const [row, col] = emptyCell;

    // 정답 그리드 생성
    const solutionGrid = copyGrid(initialGrid);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentGrid[r][c] !== null) {
          solutionGrid[r][c] = currentGrid[r][c];
        }
      }
    }
    solveSudoku(solutionGrid);

    const newGrid = copyGrid(currentGrid);
    newGrid[row][col] = solutionGrid[row][col];
    setCurrentGrid(newGrid);
    setHintsUsed((h) => h + 1);
    setSelectedCell([row, col]);
    soundManager.playMatch();
  }, [currentGrid, initialGrid, isComplete]);

  // 타이머 포맷
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 난이도 선택 화면
  if (!difficulty || !currentGrid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Header title="🧩 스도쿠" showBack />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-8xl">🧩</div>
            <h2 className="text-3xl font-bold text-textDark">스도쿠</h2>
            <p className="text-gray-600">
              1부터 9까지 숫자를 채워서
              <br />
              모든 행, 열, 3×3 박스를 완성하세요!
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
                  <div className="text-sm text-gray-600">초보자를 위한 난이도</div>
                  <div className="text-xs text-gray-500 mt-1">51개의 숫자 제공</div>
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
                  <div className="text-sm text-gray-600">적당한 도전!</div>
                  <div className="text-xs text-gray-500 mt-1">36개의 숫자 제공</div>
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
                  <div className="text-sm text-gray-600">전문가를 위한 난이도!</div>
                  <div className="text-xs text-gray-500 mt-1">26개의 숫자 제공</div>
                </div>
                <div className="text-4xl">→</div>
              </div>
            </button>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
            <div className="font-bold text-blue-900">📝 규칙:</div>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>• 각 행에 1-9가 한 번씩만</li>
              <li>• 각 열에 1-9가 한 번씩만</li>
              <li>• 각 3×3 박스에 1-9가 한 번씩만</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 게임 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-6">
      <Header
        title="🧩 스도쿠"
        showBack
        rightElement={
          <button
            onClick={() => {
              setDifficulty(null);
              setCurrentGrid(null);
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
              <div className="text-2xl font-bold text-red-500">{mistakes}</div>
              <div className="text-xs text-gray-600">실수</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{hintsUsed}</div>
              <div className="text-xs text-gray-600">힌트</div>
            </div>
          </div>
        </div>

        {/* 스도쿠 그리드 */}
        <div className={`bg-white rounded-xl p-4 shadow-lg ${showError ? 'animate-shake' : ''}`}>
          <div className="grid grid-cols-9 gap-0 border-4 border-gray-800 rounded-lg overflow-hidden">
            {currentGrid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isSelected =
                  selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex;
                const isFixed = initialGrid?.[rowIndex][colIndex] !== null;
                const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8;
                const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => {
                      setSelectedCell([rowIndex, colIndex]);
                      soundManager.playClick();
                    }}
                    className={`
                      aspect-square flex items-center justify-center
                      text-lg font-bold
                      border border-gray-300
                      ${isRightBorder ? 'border-r-4 border-r-gray-800' : ''}
                      ${isBottomBorder ? 'border-b-4 border-b-gray-800' : ''}
                      ${isSelected ? 'bg-blue-200' : 'bg-white hover:bg-gray-100'}
                      ${isFixed ? 'text-gray-900' : 'text-blue-600'}
                      active:scale-95 transition-all
                      ${isComplete ? 'bg-green-50' : ''}
                    `}
                    disabled={isComplete}
                  >
                    {cell || ''}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* 숫자 입력 패드 */}
        {!isComplete && (
          <div className="bg-white rounded-xl p-4 shadow-md space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="bg-blue-500 text-white font-bold text-xl py-4 rounded-lg hover:bg-blue-600 active:scale-95 transition-all shadow-md"
                  disabled={!selectedCell}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="bg-red-500 text-white font-bold py-4 rounded-lg hover:bg-red-600 active:scale-95 transition-all shadow-md col-span-2"
                disabled={!selectedCell}
              >
                지우기
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={handleHint}
                fullWidth
                disabled={!currentGrid || isPuzzleComplete(currentGrid)}
              >
                💡 힌트
              </Button>
            </div>
          </div>
        )}

        {/* 완료 메시지 */}
        {isComplete && (
          <div className="bg-gradient-to-r from-yellow-50 to-green-50 border-4 border-yellow-400 rounded-2xl p-6 shadow-xl text-center space-y-4 animate-bounce-in">
            <div className="text-6xl">🎉</div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-textDark">완성했습니다!</h2>
              <div className="text-lg text-gray-700">
                <div>시간: {formatTime(timer)}</div>
                <div>실수: {mistakes}회</div>
                <div>힌트: {hintsUsed}회</div>
                <div className="mt-2 text-2xl font-bold text-primary">
                  점수: {Math.max(1000 - mistakes * 50 - hintsUsed * 20 - timer, 100)}점
                </div>
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => startNewGame(difficulty)}
              fullWidth
            >
              🔄 다시 하기
            </Button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
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
