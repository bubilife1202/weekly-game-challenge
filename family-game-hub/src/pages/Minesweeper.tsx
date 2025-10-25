import { useState, useCallback } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { soundManager } from '../utils/sound';
import {
  createEmptyGrid,
  placeMines,
  calculateNeighborMines,
  revealCell,
  revealAllMines,
  checkWin,
  countFlags,
  getNumberColor,
  GAME_CONFIGS,
  type Grid,
} from '../utils/minesweeper';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

type Difficulty = 'easy' | 'medium' | 'hard';

export const Minesweeper = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [grid, setGrid] = useState<Grid | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const { addRecord } = useGameStore();
  const { currentProfileId } = useProfileStore();

  // 게임 시작
  const startGame = useCallback((diff: Difficulty) => {
    soundManager.playClick();
    const config = GAME_CONFIGS[diff];
    setDifficulty(diff);
    setGrid(createEmptyGrid(config.rows, config.cols));
    setGameStarted(false);
    setGameOver(false);
    setWon(false);
    setFlagMode(false);
    setStartTime(null);
    setEndTime(null);
  }, []);

  // 셀 클릭 (공개)
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!grid || !difficulty || gameOver) return;

      const cell = grid[row][col];
      if (cell.isRevealed || (cell.isFlagged && !flagMode)) return;

      // 깃발 모드
      if (flagMode) {
        const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
        newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
        setGrid(newGrid);
        soundManager.playClick();
        return;
      }

      // 첫 클릭 - 지뢰 배치
      if (!gameStarted) {
        let newGrid = grid.map((r) => r.map((c) => ({ ...c })));
        const config = GAME_CONFIGS[difficulty];
        newGrid = placeMines(newGrid, config.mines, row, col);
        newGrid = calculateNeighborMines(newGrid);
        newGrid = revealCell(newGrid, row, col);
        setGrid(newGrid);
        setGameStarted(true);
        setStartTime(Date.now());
        soundManager.playClick();
        return;
      }

      // 지뢰 클릭
      if (cell.isMine) {
        const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
        revealAllMines(newGrid);
        setGrid(newGrid);
        setGameOver(true);
        setEndTime(Date.now());
        soundManager.playMismatch();
        return;
      }

      // 일반 셀 공개
      const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
      revealCell(newGrid, row, col);
      setGrid(newGrid);
      soundManager.playClick();

      // 승리 체크
      if (checkWin(newGrid)) {
        setWon(true);
        setGameOver(true);
        setEndTime(Date.now());
        soundManager.playComplete();

        // 게임 결과 저장
        if (currentProfileId && startTime) {
          const time = Math.floor((Date.now() - startTime) / 1000);
          addRecord({
            profileId: currentProfileId,
            gameType: 'minesweeper',
            difficulty,
            time,
            score: Math.max(1000 - time, 100),
            completedAt: Date.now(),
          });
        }
      }
    },
    [grid, difficulty, gameOver, flagMode, gameStarted, currentProfileId, startTime, addRecord]
  );

  // 우클릭 (깃발)
  const handleCellRightClick = useCallback(
    (e: React.MouseEvent, row: number, col: number) => {
      e.preventDefault();
      if (!grid || !gameStarted || gameOver) return;

      const cell = grid[row][col];
      if (cell.isRevealed) return;

      const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
      newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
      setGrid(newGrid);
      soundManager.playClick();
    },
    [grid, gameStarted, gameOver]
  );

  // 게임 시간 계산
  const getElapsedTime = (): number => {
    if (!startTime) return 0;
    if (endTime) return Math.floor((endTime - startTime) / 1000);
    return Math.floor((Date.now() - startTime) / 1000);
  };

  // 난이도 선택 화면
  if (!difficulty || !grid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <Header title="💣 지뢰찾기" showBack />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-8xl">💣</div>
            <h2 className="text-3xl font-bold text-textDark">지뢰찾기</h2>
            <p className="text-gray-600">
              숫자를 보고 지뢰 위치를 추리하세요!
              <br />
              지뢰가 아닌 모든 셀을 열면 승리!
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
                  <div className="text-sm text-gray-600">초보자용</div>
                  <div className="text-xs text-gray-500 mt-1">9×9, 지뢰 10개</div>
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
                  <div className="text-sm text-gray-600">중급자용</div>
                  <div className="text-xs text-gray-500 mt-1">16×16, 지뢰 40개</div>
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
                  <div className="text-sm text-gray-600">전문가용!</div>
                  <div className="text-xs text-gray-500 mt-1">16×30, 지뢰 99개</div>
                </div>
                <div className="text-4xl">→</div>
              </div>
            </button>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
            <div className="font-bold text-blue-900">🎮 조작법:</div>
            <ul className="text-sm text-blue-800 space-y-1 ml-4">
              <li>• 왼쪽 클릭: 셀 열기</li>
              <li>• 우클릭 또는 깃발 모드: 깃발 표시</li>
              <li>• 숫자 = 주변 지뢰 개수</li>
              <li>• 모든 지뢰 찾기!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 게임 화면
  const config = GAME_CONFIGS[difficulty];
  const cellSize = Math.min(Math.floor(Math.min(window.innerWidth * 0.9, 600) / config.cols), 30);
  const flags = countFlags(grid);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 pb-6">
      <Header
        title="💣 지뢰찾기"
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

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 상태 표시 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {config.mines - flags}
              </div>
              <div className="text-xs text-gray-600">남은 지뢰</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {gameStarted ? getElapsedTime() : 0}
              </div>
              <div className="text-xs text-gray-600">시간 (초)</div>
            </div>
            <div>
              <button
                onClick={() => setFlagMode(!flagMode)}
                className={`text-2xl font-bold px-4 py-2 rounded-lg transition-all ${
                  flagMode
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🚩
              </button>
              <div className="text-xs text-gray-600 mt-1">
                {flagMode ? '깃발 모드' : '공개 모드'}
              </div>
            </div>
          </div>
        </div>

        {/* 게임 보드 */}
        <div className="bg-white rounded-xl p-2 sm:p-4 shadow-lg flex justify-center items-center overflow-auto">
          <div
            className="grid gap-0 border-2 border-gray-600"
            style={{
              gridTemplateColumns: `repeat(${config.cols}, ${cellSize}px)`,
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
                  disabled={gameOver}
                  className={`
                    border border-gray-400 font-bold flex items-center justify-center
                    ${
                      cell.isRevealed
                        ? cell.isMine
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100'
                        : 'bg-gray-300 hover:bg-gray-400 active:bg-gray-500'
                    }
                    ${!cell.isRevealed && !gameOver ? 'cursor-pointer' : ''}
                    transition-colors
                  `}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    fontSize: cellSize * 0.6,
                  }}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      '💣'
                    ) : cell.neighborMines > 0 ? (
                      <span className={getNumberColor(cell.neighborMines)}>
                        {cell.neighborMines}
                      </span>
                    ) : (
                      ''
                    )
                  ) : cell.isFlagged ? (
                    '🚩'
                  ) : (
                    ''
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 게임 오버/승리 메시지 */}
        {gameOver && (
          <div
            className={`${
              won
                ? 'bg-gradient-to-r from-yellow-50 to-green-50 border-yellow-400'
                : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-400'
            } border-4 rounded-2xl p-6 shadow-xl text-center space-y-4 animate-bounce-in`}
          >
            <div className="text-6xl">{won ? '🎉' : '💥'}</div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-textDark">
                {won ? '승리!' : 'Game Over!'}
              </h2>
              <div className="text-lg text-gray-700">
                <div>시간: {getElapsedTime()}초</div>
                {won && (
                  <div className="mt-2 text-2xl font-bold text-primary">
                    점수: {Math.max(1000 - getElapsedTime(), 100)}점
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
