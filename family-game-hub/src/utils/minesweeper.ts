// 지뢰찾기 게임 로직

export type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export type Grid = Cell[][];

export type GameConfig = {
  rows: number;
  cols: number;
  mines: number;
};

// 난이도별 설정
export const GAME_CONFIGS: Record<string, GameConfig> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

// 빈 그리드 생성
export const createEmptyGrid = (rows: number, cols: number): Grid => {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        }))
    );
};

// 지뢰 배치 (첫 클릭 위치 제외)
export const placeMines = (
  grid: Grid,
  mineCount: number,
  excludeRow: number,
  excludeCol: number
): Grid => {
  const rows = grid.length;
  const cols = grid[0].length;
  let minesPlaced = 0;

  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    // 첫 클릭 위치와 이미 지뢰가 있는 위치는 제외
    if (
      !grid[row][col].isMine &&
      !(row === excludeRow && col === excludeCol)
    ) {
      grid[row][col].isMine = true;
      minesPlaced++;
    }
  }

  return grid;
};

// 주변 지뢰 개수 계산
export const calculateNeighborMines = (grid: Grid): Grid => {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!grid[row][col].isMine) {
        let count = 0;

        // 8방향 체크
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;

            const newRow = row + dr;
            const newCol = col + dc;

            if (
              newRow >= 0 &&
              newRow < rows &&
              newCol >= 0 &&
              newCol < cols &&
              grid[newRow][newCol].isMine
            ) {
              count++;
            }
          }
        }

        grid[row][col].neighborMines = count;
      }
    }
  }

  return grid;
};

// 셀 공개 (재귀적으로 빈 셀 공개)
export const revealCell = (grid: Grid, row: number, col: number): Grid => {
  const rows = grid.length;
  const cols = grid[0].length;

  // 범위 체크
  if (row < 0 || row >= rows || col < 0 || col >= cols) return grid;

  const cell = grid[row][col];

  // 이미 공개되었거나 깃발이 있으면 무시
  if (cell.isRevealed || cell.isFlagged) return grid;

  // 셀 공개
  cell.isRevealed = true;

  // 빈 셀이면 주변도 공개
  if (!cell.isMine && cell.neighborMines === 0) {
    // 8방향 재귀적으로 공개
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        revealCell(grid, row + dr, col + dc);
      }
    }
  }

  return grid;
};

// 모든 지뢰 공개
export const revealAllMines = (grid: Grid): Grid => {
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isMine) {
        cell.isRevealed = true;
      }
    });
  });
  return grid;
};

// 게임 클리어 체크
export const checkWin = (grid: Grid): boolean => {
  for (const row of grid) {
    for (const cell of row) {
      // 지뢰가 아닌 셀이 공개되지 않았으면 아직 클리어 안 됨
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
};

// 깃발 개수 세기
export const countFlags = (grid: Grid): number => {
  let count = 0;
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isFlagged) count++;
    });
  });
  return count;
};

// 공개된 셀 개수 세기
export const countRevealed = (grid: Grid): number => {
  let count = 0;
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isRevealed && !cell.isMine) count++;
    });
  });
  return count;
};

// 숫자 색상 가져오기
export const getNumberColor = (num: number): string => {
  const colors: Record<number, string> = {
    1: 'text-blue-600',
    2: 'text-green-600',
    3: 'text-red-600',
    4: 'text-purple-600',
    5: 'text-orange-600',
    6: 'text-cyan-600',
    7: 'text-gray-800',
    8: 'text-pink-600',
  };
  return colors[num] || 'text-gray-600';
};
