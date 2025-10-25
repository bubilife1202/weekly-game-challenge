// 2048 게임 로직

export type Cell = number | null;
export type Grid = Cell[][];
export type Direction = 'up' | 'down' | 'left' | 'right';

// 빈 그리드 생성
export const createEmptyGrid = (size: number): Grid => {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(null));
};

// 초기 그리드 생성 (랜덤 2개 타일)
export const createInitialGrid = (size: number): Grid => {
  const grid = createEmptyGrid(size);
  addRandomTile(grid);
  addRandomTile(grid);
  return grid;
};

// 빈 셀 찾기
export const getEmptyCells = (grid: Grid): { row: number; col: number }[] => {
  const emptyCells: { row: number; col: number }[] = [];
  grid.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === null) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });
  return emptyCells;
};

// 랜덤 타일 추가 (90% 확률로 2, 10% 확률로 4)
export const addRandomTile = (grid: Grid): boolean => {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return false;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  grid[row][col] = Math.random() < 0.9 ? 2 : 4;
  return true;
};

// 그리드 복사
export const copyGrid = (grid: Grid): Grid => {
  return grid.map((row) => [...row]);
};

// 행 압축 (null 제거)
const compress = (row: Cell[]): Cell[] => {
  return row.filter((cell) => cell !== null);
};

// 행 합치기
const merge = (row: Cell[]): { row: Cell[]; score: number } => {
  let score = 0;
  const result: Cell[] = [];
  let i = 0;

  while (i < row.length) {
    if (i + 1 < row.length && row[i] === row[i + 1]) {
      const merged = (row[i]! as number) * 2;
      result.push(merged);
      score += merged;
      i += 2;
    } else {
      result.push(row[i]);
      i += 1;
    }
  }

  return { row: result, score };
};

// 행 이동 및 합치기
const moveRow = (row: Cell[], size: number): { row: Cell[]; score: number } => {
  // null 제거
  let compressed = compress(row);
  // 합치기
  const { row: merged, score } = merge(compressed);
  // 빈 공간 채우기
  while (merged.length < size) {
    merged.push(null);
  }
  return { row: merged, score };
};

// 그리드 회전 (시계방향 90도)
const rotateGrid = (grid: Grid): Grid => {
  const size = grid.length;
  const rotated = createEmptyGrid(size);
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      rotated[col][size - 1 - row] = grid[row][col];
    }
  }
  return rotated;
};

// 방향에 따라 이동
export const move = (
  grid: Grid,
  direction: Direction
): { grid: Grid; score: number; moved: boolean } => {
  const size = grid.length;
  let workingGrid = copyGrid(grid);
  let totalScore = 0;

  // 왼쪽 이동을 기준으로 회전
  let rotations = 0;
  switch (direction) {
    case 'left':
      rotations = 0;
      break;
    case 'up':
      rotations = 1;
      break;
    case 'right':
      rotations = 2;
      break;
    case 'down':
      rotations = 3;
      break;
  }

  // 회전
  for (let i = 0; i < rotations; i++) {
    workingGrid = rotateGrid(workingGrid);
  }

  // 각 행을 왼쪽으로 이동
  const newGrid = workingGrid.map((row) => {
    const { row: movedRow, score } = moveRow(row, size);
    totalScore += score;
    return movedRow;
  });

  // 역회전
  let resultGrid = newGrid;
  for (let i = 0; i < 4 - rotations; i++) {
    resultGrid = rotateGrid(resultGrid);
  }

  // 이동했는지 확인
  const moved = !gridsEqual(grid, resultGrid);

  return { grid: resultGrid, score: totalScore, moved };
};

// 두 그리드가 같은지 확인
const gridsEqual = (grid1: Grid, grid2: Grid): boolean => {
  for (let row = 0; row < grid1.length; row++) {
    for (let col = 0; col < grid1[row].length; col++) {
      if (grid1[row][col] !== grid2[row][col]) {
        return false;
      }
    }
  }
  return true;
};

// 이동 가능한지 확인
export const canMove = (grid: Grid): boolean => {
  // 빈 셀이 있으면 이동 가능
  if (getEmptyCells(grid).length > 0) return true;

  // 인접한 같은 숫자가 있으면 합칠 수 있음
  const size = grid.length;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const current = grid[row][col];
      // 오른쪽 확인
      if (col < size - 1 && grid[row][col + 1] === current) return true;
      // 아래 확인
      if (row < size - 1 && grid[row + 1][col] === current) return true;
    }
  }

  return false;
};

// 최고 타일 찾기
export const getMaxTile = (grid: Grid): number => {
  let max = 0;
  grid.forEach((row) => {
    row.forEach((cell) => {
      if (cell && cell > max) {
        max = cell;
      }
    });
  });
  return max;
};

// 타일 색상 가져오기
export const getTileColor = (value: number | null): string => {
  if (!value) return 'bg-gray-200';

  const colors: Record<number, string> = {
    2: 'bg-amber-100 text-gray-800',
    4: 'bg-amber-200 text-gray-800',
    8: 'bg-orange-300 text-white',
    16: 'bg-orange-400 text-white',
    32: 'bg-orange-500 text-white',
    64: 'bg-red-400 text-white',
    128: 'bg-yellow-400 text-white',
    256: 'bg-yellow-500 text-white',
    512: 'bg-yellow-600 text-white',
    1024: 'bg-yellow-700 text-white',
    2048: 'bg-yellow-800 text-white',
    4096: 'bg-purple-500 text-white',
    8192: 'bg-purple-600 text-white',
  };

  return colors[value] || 'bg-gray-800 text-white';
};

// 난이도별 그리드 크기
export const GRID_SIZES = {
  easy: 4,
  medium: 5,
  hard: 6,
};
