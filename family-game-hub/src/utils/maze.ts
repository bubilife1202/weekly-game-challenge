// 미로 생성 및 관리 유틸리티

export type MazeCell = {
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  hasStar?: boolean;
};

export type Position = {
  row: number;
  col: number;
};

export type MazeGrid = MazeCell[][];

// 빈 미로 그리드 생성 (모든 벽이 있는 상태)
export const createEmptyMaze = (rows: number, cols: number): MazeGrid => {
  const maze: MazeGrid = [];
  for (let row = 0; row < rows; row++) {
    maze[row] = [];
    for (let col = 0; col < cols; col++) {
      maze[row][col] = {
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
      };
    }
  }
  return maze;
};

// Recursive Backtracking 알고리즘으로 미로 생성
export const generateMaze = (rows: number, cols: number): MazeGrid => {
  const maze = createEmptyMaze(rows, cols);
  const stack: Position[] = [];

  // 시작점 (0, 0)
  const start: Position = { row: 0, col: 0 };
  maze[0][0].visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(maze, current, rows, cols);

    if (neighbors.length > 0) {
      // 랜덤으로 이웃 선택
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];

      // 현재 셀과 선택된 셀 사이의 벽 제거
      removeWall(maze, current, next);

      // 선택된 셀을 방문 표시하고 스택에 추가
      maze[next.row][next.col].visited = true;
      stack.push(next);
    } else {
      // 막다른 길이면 백트래킹
      stack.pop();
    }
  }

  // 별 배치 (수집 아이템)
  placeStars(maze, rows, cols);

  return maze;
};

// 방문하지 않은 이웃 셀 찾기
const getUnvisitedNeighbors = (
  maze: MazeGrid,
  pos: Position,
  rows: number,
  cols: number
): Position[] => {
  const neighbors: Position[] = [];
  const { row, col } = pos;

  // 위
  if (row > 0 && !maze[row - 1][col].visited) {
    neighbors.push({ row: row - 1, col });
  }
  // 오른쪽
  if (col < cols - 1 && !maze[row][col + 1].visited) {
    neighbors.push({ row, col: col + 1 });
  }
  // 아래
  if (row < rows - 1 && !maze[row + 1][col].visited) {
    neighbors.push({ row: row + 1, col });
  }
  // 왼쪽
  if (col > 0 && !maze[row][col - 1].visited) {
    neighbors.push({ row, col: col - 1 });
  }

  return neighbors;
};

// 두 셀 사이의 벽 제거
const removeWall = (maze: MazeGrid, current: Position, next: Position) => {
  const rowDiff = next.row - current.row;
  const colDiff = next.col - current.col;

  if (rowDiff === 1) {
    // 아래로 이동
    maze[current.row][current.col].walls.bottom = false;
    maze[next.row][next.col].walls.top = false;
  } else if (rowDiff === -1) {
    // 위로 이동
    maze[current.row][current.col].walls.top = false;
    maze[next.row][next.col].walls.bottom = false;
  } else if (colDiff === 1) {
    // 오른쪽으로 이동
    maze[current.row][current.col].walls.right = false;
    maze[next.row][next.col].walls.left = false;
  } else if (colDiff === -1) {
    // 왼쪽으로 이동
    maze[current.row][current.col].walls.left = false;
    maze[next.row][next.col].walls.right = false;
  }
};

// 미로에 별(수집 아이템) 배치
const placeStars = (maze: MazeGrid, rows: number, cols: number) => {
  const totalCells = rows * cols;
  const starCount = Math.floor(totalCells * 0.15); // 전체 셀의 15%에 별 배치

  let placed = 0;
  while (placed < starCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    // 시작점과 끝점은 피함
    if ((row === 0 && col === 0) || (row === rows - 1 && col === cols - 1)) {
      continue;
    }

    if (!maze[row][col].hasStar) {
      maze[row][col].hasStar = true;
      placed++;
    }
  }
};

// 플레이어가 이동할 수 있는지 확인
export const canMove = (
  maze: MazeGrid,
  from: Position,
  direction: 'up' | 'down' | 'left' | 'right'
): boolean => {
  const cell = maze[from.row][from.col];

  switch (direction) {
    case 'up':
      return !cell.walls.top;
    case 'down':
      return !cell.walls.bottom;
    case 'left':
      return !cell.walls.left;
    case 'right':
      return !cell.walls.right;
    default:
      return false;
  }
};

// 다음 위치 계산
export const getNextPosition = (
  pos: Position,
  direction: 'up' | 'down' | 'left' | 'right',
  rows: number,
  cols: number
): Position | null => {
  let newRow = pos.row;
  let newCol = pos.col;

  switch (direction) {
    case 'up':
      newRow--;
      break;
    case 'down':
      newRow++;
      break;
    case 'left':
      newCol--;
      break;
    case 'right':
      newCol++;
      break;
  }

  // 경계 체크
  if (newRow < 0 || newRow >= rows || newCol < 0 || newCol >= cols) {
    return null;
  }

  return { row: newRow, col: newCol };
};

// 미로 크기 프리셋
export const MAZE_SIZES = {
  easy: { rows: 8, cols: 8, name: '쉬움' },
  medium: { rows: 12, cols: 12, name: '보통' },
  hard: { rows: 16, cols: 16, name: '어려움' },
};
