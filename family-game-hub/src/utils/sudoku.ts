// 스도쿠 퍼즐 생성 및 검증 유틸리티

export type SudokuGrid = (number | null)[][];
export type SudokuCell = {
  value: number | null;
  isFixed: boolean;
  notes: number[];
};

// 빈 9x9 그리드 생성
export const createEmptyGrid = (): SudokuGrid => {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));
};

// 특정 위치에 숫자를 놓을 수 있는지 검증
export const isValidPlacement = (
  grid: SudokuGrid,
  row: number,
  col: number,
  num: number
): boolean => {
  // 행 체크
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }

  // 열 체크
  for (let x = 0; x < 9; x++) {
    if (grid[x][col] === num) return false;
  }

  // 3x3 박스 체크
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
};

// 백트래킹을 사용한 스도쿠 해결
export const solveSudoku = (grid: SudokuGrid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValidPlacement(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid)) {
              return true;
            }

            grid[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// 완성된 스도쿠 그리드 생성
export const generateCompleteGrid = (): SudokuGrid => {
  const grid = createEmptyGrid();

  // 첫 번째 행을 무작위로 채움
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  grid[0] = numbers;

  // 나머지를 백트래킹으로 채움
  solveSudoku(grid);

  return grid;
};

// 그리드 복사
export const copyGrid = (grid: SudokuGrid): SudokuGrid => {
  return grid.map((row) => [...row]);
};

// 난이도에 따라 셀을 비움
export const createPuzzle = (difficulty: 'easy' | 'medium' | 'hard'): SudokuGrid => {
  const completeGrid = generateCompleteGrid();
  const puzzleGrid = copyGrid(completeGrid);

  // 난이도별 비울 셀 개수
  const cellsToRemove = {
    easy: 30,    // 쉬움: 30개 비움 (51개 채워짐)
    medium: 45,  // 보통: 45개 비움 (36개 채워짐)
    hard: 55,    // 어려움: 55개 비움 (26개 채워짐)
  };

  const removeCount = cellsToRemove[difficulty];
  let removed = 0;

  while (removed < removeCount) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzleGrid[row][col] !== null) {
      puzzleGrid[row][col] = null;
      removed++;
    }
  }

  return puzzleGrid;
};

// 퍼즐이 완성되었는지 확인
export const isPuzzleComplete = (grid: SudokuGrid): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) return false;
    }
  }
  return true;
};

// 현재 그리드가 유효한지 확인 (완성 여부와 상관없이)
export const isGridValid = (grid: SudokuGrid): boolean => {
  // 행 검증
  for (let row = 0; row < 9; row++) {
    const seen = new Set<number>();
    for (let col = 0; col < 9; col++) {
      const num = grid[row][col];
      if (num !== null) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }
  }

  // 열 검증
  for (let col = 0; col < 9; col++) {
    const seen = new Set<number>();
    for (let row = 0; row < 9; row++) {
      const num = grid[row][col];
      if (num !== null) {
        if (seen.has(num)) return false;
        seen.add(num);
      }
    }
  }

  // 3x3 박스 검증
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = new Set<number>();
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const num = grid[boxRow * 3 + i][boxCol * 3 + j];
          if (num !== null) {
            if (seen.has(num)) return false;
            seen.add(num);
          }
        }
      }
    }
  }

  return true;
};

// 힌트를 위한 다음 빈 셀 찾기
export const findEmptyCell = (grid: SudokuGrid): [number, number] | null => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return [row, col];
      }
    }
  }
  return null;
};

// 특정 셀에 들어갈 수 있는 가능한 숫자들 찾기
export const getPossibleNumbers = (
  grid: SudokuGrid,
  row: number,
  col: number
): number[] => {
  const possible: number[] = [];
  for (let num = 1; num <= 9; num++) {
    if (isValidPlacement(grid, row, col, num)) {
      possible.push(num);
    }
  }
  return possible;
};
