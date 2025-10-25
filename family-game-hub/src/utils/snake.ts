// Snake 게임 로직

export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type SnakeState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  gameOver: boolean;
};

// 초기 Snake 상태 생성
export const createInitialState = (gridSize: number): SnakeState => {
  const center = Math.floor(gridSize / 2);
  return {
    snake: [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ],
    food: generateFood(gridSize, [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ]),
    direction: 'RIGHT',
    score: 0,
    gameOver: false,
  };
};

// 음식 위치 생성 (뱀과 겹치지 않게)
export const generateFood = (gridSize: number, snake: Position[]): Position => {
  let food: Position;
  let isValid = false;

  while (!isValid) {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };

    // 뱀 몸통과 겹치지 않는지 확인
    isValid = !snake.some((segment) => segment.x === food.x && segment.y === food.y);
  }

  return food!;
};

// 다음 머리 위치 계산
export const getNextHeadPosition = (head: Position, direction: Direction): Position => {
  switch (direction) {
    case 'UP':
      return { x: head.x, y: head.y - 1 };
    case 'DOWN':
      return { x: head.x, y: head.y + 1 };
    case 'LEFT':
      return { x: head.x - 1, y: head.y };
    case 'RIGHT':
      return { x: head.x + 1, y: head.y };
  }
};

// 벽 충돌 체크
export const checkWallCollision = (position: Position, gridSize: number): boolean => {
  return (
    position.x < 0 ||
    position.x >= gridSize ||
    position.y < 0 ||
    position.y >= gridSize
  );
};

// 자기 몸 충돌 체크
export const checkSelfCollision = (head: Position, snake: Position[]): boolean => {
  // 머리를 제외한 몸통과 충돌 확인
  return snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);
};

// 음식 먹었는지 체크
export const checkFoodCollision = (head: Position, food: Position): boolean => {
  return head.x === food.x && head.y === food.y;
};

// Snake 이동
export const moveSnake = (state: SnakeState, gridSize: number): SnakeState => {
  const head = state.snake[0];
  const newHead = getNextHeadPosition(head, state.direction);

  // 벽 충돌 체크
  if (checkWallCollision(newHead, gridSize)) {
    return { ...state, gameOver: true };
  }

  // 자기 몸 충돌 체크
  if (checkSelfCollision(newHead, state.snake)) {
    return { ...state, gameOver: true };
  }

  // 새로운 뱀 (머리 추가)
  const newSnake = [newHead, ...state.snake];

  // 음식 먹었는지 확인
  if (checkFoodCollision(newHead, state.food)) {
    // 음식 먹으면 꼬리 안 자름 (길이 증가)
    return {
      ...state,
      snake: newSnake,
      food: generateFood(gridSize, newSnake),
      score: state.score + 10,
    };
  } else {
    // 음식 안 먹으면 꼬리 자름 (길이 유지)
    newSnake.pop();
    return {
      ...state,
      snake: newSnake,
    };
  }
};

// 방향 변경 (역방향은 불가능)
export const changeDirection = (
  currentDirection: Direction,
  newDirection: Direction
): Direction => {
  // 반대 방향으로는 못 감
  const opposites: Record<Direction, Direction> = {
    UP: 'DOWN',
    DOWN: 'UP',
    LEFT: 'RIGHT',
    RIGHT: 'LEFT',
  };

  if (opposites[currentDirection] === newDirection) {
    return currentDirection;
  }

  return newDirection;
};

// 난이도별 속도 (ms)
export const GAME_SPEEDS = {
  easy: 200,
  medium: 150,
  hard: 100,
};

// 난이도별 그리드 크기
export const GRID_SIZES = {
  easy: 15,
  medium: 20,
  hard: 25,
};
