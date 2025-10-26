// Breakout/Brick Breaker game logic

export type Position = {
  x: number;
  y: number;
};

export type Ball = Position & {
  dx: number; // velocity
  dy: number;
  radius: number;
};

export type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Brick = {
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number; // how many hits to break (1-3)
  broken: boolean;
  color: string;
};

export type GameState = {
  paddle: Paddle;
  ball: Ball;
  bricks: Brick[];
  score: number;
  lives: number;
  level: number;
  gameOver: boolean;
  won: boolean;
  gameStarted: boolean;
};

export const GAME_CONFIG = {
  width: 400,
  height: 600,
  paddleWidth: 80,
  paddleHeight: 12,
  ballRadius: 6,
  ballSpeed: 4,
  brickRows: 6,
  brickCols: 8,
  brickWidth: 45,
  brickHeight: 20,
  brickPadding: 5,
  brickOffsetTop: 60,
  brickOffsetLeft: 10,
};

const BRICK_COLORS = {
  1: '#4ade80', // green (1 hit)
  2: '#fbbf24', // yellow (2 hits)
  3: '#ef4444', // red (3 hits)
};

export const createInitialState = (level: number = 1): GameState => {
  const paddle: Paddle = {
    x: GAME_CONFIG.width / 2 - GAME_CONFIG.paddleWidth / 2,
    y: GAME_CONFIG.height - 30,
    width: GAME_CONFIG.paddleWidth,
    height: GAME_CONFIG.paddleHeight,
  };

  const ball: Ball = {
    x: GAME_CONFIG.width / 2,
    y: paddle.y - GAME_CONFIG.ballRadius - 1,
    dx: GAME_CONFIG.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    dy: -GAME_CONFIG.ballSpeed,
    radius: GAME_CONFIG.ballRadius,
  };

  const bricks = createBricks(level);

  return {
    paddle,
    ball,
    bricks,
    score: 0,
    lives: 3,
    level,
    gameOver: false,
    won: false,
    gameStarted: false,
  };
};

const createBricks = (level: number): Brick[] => {
  const bricks: Brick[] = [];
  const rows = Math.min(GAME_CONFIG.brickRows + Math.floor(level / 2), 10);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < GAME_CONFIG.brickCols; col++) {
      const hits = Math.min(Math.floor(row / 2) + 1, 3);
      bricks.push({
        x: GAME_CONFIG.brickOffsetLeft + col * (GAME_CONFIG.brickWidth + GAME_CONFIG.brickPadding),
        y: GAME_CONFIG.brickOffsetTop + row * (GAME_CONFIG.brickHeight + GAME_CONFIG.brickPadding),
        width: GAME_CONFIG.brickWidth,
        height: GAME_CONFIG.brickHeight,
        hits,
        broken: false,
        color: BRICK_COLORS[hits as 1 | 2 | 3],
      });
    }
  }

  return bricks;
};

export const movePaddle = (state: GameState, x: number): GameState => {
  const newX = Math.max(0, Math.min(x, GAME_CONFIG.width - state.paddle.width));
  return {
    ...state,
    paddle: { ...state.paddle, x: newX },
  };
};

export const startBall = (state: GameState): GameState => {
  if (state.gameStarted) return state;
  return { ...state, gameStarted: true };
};

export const updateGame = (state: GameState): GameState => {
  if (state.gameOver || !state.gameStarted) return state;

  let newState = { ...state };

  // Move ball
  let newBall = { ...newState.ball };
  newBall.x += newBall.dx;
  newBall.y += newBall.dy;

  // Wall collision
  if (newBall.x - newBall.radius < 0 || newBall.x + newBall.radius > GAME_CONFIG.width) {
    newBall.dx = -newBall.dx;
    newBall.x = Math.max(newBall.radius, Math.min(newBall.x, GAME_CONFIG.width - newBall.radius));
  }

  if (newBall.y - newBall.radius < 0) {
    newBall.dy = -newBall.dy;
    newBall.y = newBall.radius;
  }

  // Paddle collision
  if (
    newBall.y + newBall.radius >= newState.paddle.y &&
    newBall.y - newBall.radius <= newState.paddle.y + newState.paddle.height &&
    newBall.x >= newState.paddle.x &&
    newBall.x <= newState.paddle.x + newState.paddle.width
  ) {
    newBall.dy = -Math.abs(newBall.dy);
    // Add spin based on where it hits paddle
    const hitPos = (newBall.x - newState.paddle.x) / newState.paddle.width;
    newBall.dx = (hitPos - 0.5) * GAME_CONFIG.ballSpeed * 2;
    newBall.y = newState.paddle.y - newBall.radius;
  }

  // Brick collision
  let scoreIncrease = 0;
  const newBricks = newState.bricks.map((brick) => {
    if (brick.broken) return brick;

    if (
      newBall.x + newBall.radius > brick.x &&
      newBall.x - newBall.radius < brick.x + brick.width &&
      newBall.y + newBall.radius > brick.y &&
      newBall.y - newBall.radius < brick.y + brick.height
    ) {
      // Hit brick
      const newHits = brick.hits - 1;
      if (newHits <= 0) {
        scoreIncrease += brick.hits * 10;
        brick = { ...brick, broken: true };
      } else {
        scoreIncrease += 5;
        brick = { ...brick, hits: newHits, color: BRICK_COLORS[newHits as 1 | 2 | 3] };
      }

      // Bounce ball
      const fromLeft = Math.abs(newBall.x - brick.x);
      const fromRight = Math.abs(newBall.x - (brick.x + brick.width));
      const fromTop = Math.abs(newBall.y - brick.y);
      const fromBottom = Math.abs(newBall.y - (brick.y + brick.height));

      const minDist = Math.min(fromLeft, fromRight, fromTop, fromBottom);

      if (minDist === fromLeft || minDist === fromRight) {
        newBall.dx = -newBall.dx;
      } else {
        newBall.dy = -newBall.dy;
      }
    }

    return brick;
  });

  newState.bricks = newBricks;
  newState.score += scoreIncrease;
  newState.ball = newBall;

  // Check if ball fell
  if (newBall.y - newBall.radius > GAME_CONFIG.height) {
    newState.lives -= 1;
    if (newState.lives <= 0) {
      newState.gameOver = true;
    } else {
      // Reset ball
      newState.ball = {
        x: GAME_CONFIG.width / 2,
        y: newState.paddle.y - GAME_CONFIG.ballRadius - 1,
        dx: GAME_CONFIG.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
        dy: -GAME_CONFIG.ballSpeed,
        radius: GAME_CONFIG.ballRadius,
      };
      newState.gameStarted = false;
    }
  }

  // Check if won
  const allBroken = newBricks.every((brick) => brick.broken);
  if (allBroken) {
    newState.won = true;
    newState.gameOver = true;
  }

  return newState;
};

export const nextLevel = (state: GameState): GameState => {
  const newLevel = state.level + 1;
  const newState = createInitialState(newLevel);
  newState.score = state.score;
  newState.lives = state.lives;
  return newState;
};
