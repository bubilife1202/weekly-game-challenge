// 갤러그 스타일 슈팅 게임 로직

export type Position = {
  x: number;
  y: number;
};

export type Bullet = Position & {
  id: number;
};

export type Enemy = Position & {
  id: number;
  type: number; // 1, 2, 3 (다른 모양/점수)
  speed: number;
};

export type GameState = {
  playerX: number;
  bullets: Bullet[];
  enemies: Enemy[];
  score: number;
  lives: number;
  level: number;
  gameOver: boolean;
};

// 게임 설정
export const GAME_CONFIG = {
  width: 400,
  height: 600,
  playerWidth: 40,
  playerHeight: 40,
  playerSpeed: 8,
  bulletSpeed: 10,
  bulletWidth: 4,
  bulletHeight: 15,
  enemyWidth: 30,
  enemyHeight: 30,
  enemyBaseSpeed: 1,
};

// 초기 상태 생성
export const createInitialState = (): GameState => {
  return {
    playerX: GAME_CONFIG.width / 2,
    bullets: [],
    enemies: [],
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
  };
};

// 적 생성 (레벨별로 개수 증가)
export const createEnemies = (level: number): Enemy[] => {
  const enemies: Enemy[] = [];
  const rows = Math.min(3 + Math.floor(level / 2), 6);
  const cols = 8;
  const spacing = 45;
  const startX = (GAME_CONFIG.width - cols * spacing) / 2;
  let id = 0;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      enemies.push({
        id: id++,
        x: startX + col * spacing + 20,
        y: 50 + row * 45,
        type: row < 2 ? 1 : row < 4 ? 2 : 3,
        speed: GAME_CONFIG.enemyBaseSpeed * (1 + level * 0.1),
      });
    }
  }

  return enemies;
};

// 총알 생성
export const createBullet = (playerX: number): Bullet => {
  return {
    id: Date.now(),
    x: playerX,
    y: GAME_CONFIG.height - GAME_CONFIG.playerHeight - 10,
  };
};

// 플레이어 이동
export const movePlayer = (state: GameState, direction: 'left' | 'right'): GameState => {
  let newX = state.playerX;

  if (direction === 'left') {
    newX = Math.max(GAME_CONFIG.playerWidth / 2, state.playerX - GAME_CONFIG.playerSpeed);
  } else {
    newX = Math.min(
      GAME_CONFIG.width - GAME_CONFIG.playerWidth / 2,
      state.playerX + GAME_CONFIG.playerSpeed
    );
  }

  return { ...state, playerX: newX };
};

// 총알 이동
export const moveBullets = (state: GameState): GameState => {
  const bullets = state.bullets
    .map((bullet) => ({
      ...bullet,
      y: bullet.y - GAME_CONFIG.bulletSpeed,
    }))
    .filter((bullet) => bullet.y > 0);

  return { ...state, bullets };
};

// 적 이동 (좌우 + 아래로)
let enemyDirection = 1; // 1: right, -1: left
let enemyMoveDown = false;

export const moveEnemies = (state: GameState): GameState => {
  let enemies = [...state.enemies];

  // 벽에 닿았는지 확인
  const hitWall = enemies.some(
    (enemy) =>
      (enemyDirection > 0 && enemy.x + GAME_CONFIG.enemyWidth / 2 >= GAME_CONFIG.width - 10) ||
      (enemyDirection < 0 && enemy.x - GAME_CONFIG.enemyWidth / 2 <= 10)
  );

  if (hitWall) {
    enemyDirection *= -1;
    enemyMoveDown = true;
  }

  // 이동
  enemies = enemies.map((enemy) => ({
    ...enemy,
    x: enemy.x + enemy.speed * enemyDirection * 2,
    y: enemyMoveDown ? enemy.y + 20 : enemy.y,
  }));

  enemyMoveDown = false;

  // 적이 플레이어에 도달하면 게임 오버
  const reachedBottom = enemies.some((enemy) => enemy.y >= GAME_CONFIG.height - 80);
  if (reachedBottom) {
    return { ...state, lives: 0, gameOver: true };
  }

  return { ...state, enemies };
};

// 충돌 감지
export const checkCollisions = (state: GameState): GameState => {
  let newState = { ...state };
  let enemiesHit: Set<number> = new Set();
  let bulletsHit: Set<number> = new Set();

  // 총알과 적 충돌
  newState.bullets.forEach((bullet) => {
    newState.enemies.forEach((enemy) => {
      if (
        !enemiesHit.has(enemy.id) &&
        !bulletsHit.has(bullet.id) &&
        Math.abs(bullet.x - enemy.x) < GAME_CONFIG.enemyWidth / 2 &&
        Math.abs(bullet.y - enemy.y) < GAME_CONFIG.enemyHeight / 2
      ) {
        enemiesHit.add(enemy.id);
        bulletsHit.add(bullet.id);
        newState.score += enemy.type * 10;
      }
    });
  });

  // 충돌한 총알과 적 제거
  newState.bullets = newState.bullets.filter((bullet) => !bulletsHit.has(bullet.id));
  newState.enemies = newState.enemies.filter((enemy) => !enemiesHit.has(enemy.id));

  // 모든 적 제거 시 다음 레벨
  if (newState.enemies.length === 0) {
    newState.level += 1;
    newState.enemies = createEnemies(newState.level);
    // 방향 리셋
    enemyDirection = 1;
  }

  return newState;
};

// 적 타입별 색상
export const getEnemyColor = (type: number): string => {
  const colors = {
    1: 'bg-red-500',
    2: 'bg-blue-500',
    3: 'bg-purple-500',
  };
  return colors[type as keyof typeof colors] || 'bg-gray-500';
};

// 적 타입별 이모지
export const getEnemyEmoji = (type: number): string => {
  const emojis = {
    1: '👾',
    2: '🛸',
    3: '🚀',
  };
  return emojis[type as keyof typeof emojis] || '👾';
};
