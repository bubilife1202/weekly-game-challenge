// 슈퍼마리오 스타일 플랫포머 게임 로직

export type Position = {
  x: number;
  y: number;
};

export type Velocity = {
  vx: number;
  vy: number;
};

export type Player = Position &
  Velocity & {
    width: number;
    height: number;
    onGround: boolean;
    facingRight: boolean;
  };

export type Platform = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'brick' | 'question';
};

export type Enemy = Position & {
  width: number;
  height: number;
  vx: number;
  alive: boolean;
  type: 'goomba' | 'koopa';
};

export type Coin = Position & {
  collected: boolean;
};

export type GameState = {
  player: Player;
  platforms: Platform[];
  enemies: Enemy[];
  coins: Coin[];
  score: number;
  lives: number;
  level: number;
  gameOver: boolean;
  won: boolean;
  cameraX: number;
};

export const GAME_CONFIG = {
  width: 800,
  height: 600,
  gravity: 0.8,
  jumpPower: -15,
  moveSpeed: 5,
  maxVelocityY: 20,
  playerWidth: 32,
  playerHeight: 40,
  enemyWidth: 32,
  enemyHeight: 32,
  coinSize: 20,
  goalX: 3800, // 레벨 끝 위치
};

export const createInitialState = (): GameState => {
  return {
    player: {
      x: 100,
      y: 300,
      vx: 0,
      vy: 0,
      width: GAME_CONFIG.playerWidth,
      height: GAME_CONFIG.playerHeight,
      onGround: false,
      facingRight: true,
    },
    platforms: createLevel1Platforms(),
    enemies: createLevel1Enemies(),
    coins: createLevel1Coins(),
    score: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    won: false,
    cameraX: 0,
  };
};

// 레벨 1 플랫폼 생성
function createLevel1Platforms(): Platform[] {
  const platforms: Platform[] = [];

  // 바닥
  for (let i = 0; i < 50; i++) {
    platforms.push({
      x: i * 80,
      y: 550,
      width: 80,
      height: 50,
      type: 'ground',
    });
  }

  // 플랫폼들
  const platformData = [
    { x: 300, y: 450, width: 120, type: 'brick' as const },
    { x: 500, y: 400, width: 80, type: 'brick' as const },
    { x: 700, y: 350, width: 80, type: 'brick' as const },
    { x: 900, y: 400, width: 120, type: 'brick' as const },
    { x: 1100, y: 450, width: 80, type: 'question' as const },
    { x: 1300, y: 400, width: 160, type: 'brick' as const },
    { x: 1600, y: 350, width: 100, type: 'brick' as const },
    { x: 1800, y: 450, width: 120, type: 'brick' as const },
    { x: 2100, y: 400, width: 80, type: 'brick' as const },
    { x: 2300, y: 350, width: 120, type: 'brick' as const },
    { x: 2600, y: 400, width: 160, type: 'brick' as const },
    { x: 2900, y: 450, width: 80, type: 'brick' as const },
    { x: 3100, y: 350, width: 120, type: 'brick' as const },
    { x: 3400, y: 400, width: 100, type: 'brick' as const },
  ];

  platformData.forEach((p) => {
    platforms.push({ ...p, height: 20 });
  });

  return platforms;
}

// 레벨 1 적 생성
function createLevel1Enemies(): Enemy[] {
  return [
    { x: 400, y: 510, width: 32, height: 32, vx: -2, alive: true, type: 'goomba' },
    { x: 800, y: 510, width: 32, height: 32, vx: -2, alive: true, type: 'goomba' },
    { x: 1200, y: 510, width: 32, height: 32, vx: 2, alive: true, type: 'goomba' },
    { x: 1700, y: 510, width: 32, height: 32, vx: -2, alive: true, type: 'goomba' },
    { x: 2200, y: 510, width: 32, height: 32, vx: 2, alive: true, type: 'goomba' },
    { x: 2700, y: 510, width: 32, height: 32, vx: -2, alive: true, type: 'goomba' },
    { x: 3200, y: 510, width: 32, height: 32, vx: 2, alive: true, type: 'goomba' },
  ];
}

// 레벨 1 코인 생성
function createLevel1Coins(): Coin[] {
  const coins: Coin[] = [];
  const coinPositions = [
    { x: 350, y: 400 },
    { x: 400, y: 350 },
    { x: 550, y: 350 },
    { x: 750, y: 300 },
    { x: 950, y: 350 },
    { x: 1150, y: 400 },
    { x: 1350, y: 350 },
    { x: 1650, y: 300 },
    { x: 1850, y: 400 },
    { x: 2150, y: 350 },
    { x: 2350, y: 300 },
    { x: 2650, y: 350 },
    { x: 2950, y: 400 },
    { x: 3150, y: 300 },
    { x: 3450, y: 350 },
  ];

  coinPositions.forEach((pos) => {
    coins.push({ ...pos, collected: false });
  });

  return coins;
}

// 플레이어 이동
export const movePlayer = (state: GameState, direction: 'left' | 'right'): GameState => {
  const newPlayer = { ...state.player };

  if (direction === 'left') {
    newPlayer.vx = -GAME_CONFIG.moveSpeed;
    newPlayer.facingRight = false;
  } else {
    newPlayer.vx = GAME_CONFIG.moveSpeed;
    newPlayer.facingRight = true;
  }

  return { ...state, player: newPlayer };
};

// 플레이어 점프
export const jumpPlayer = (state: GameState): GameState => {
  if (!state.player.onGround) return state;

  return {
    ...state,
    player: {
      ...state.player,
      vy: GAME_CONFIG.jumpPower,
      onGround: false,
    },
  };
};

// 물리 엔진 업데이트
export const updatePhysics = (state: GameState): GameState => {
  let newState = { ...state };
  let newPlayer = { ...newState.player };

  // 중력 적용
  newPlayer.vy += GAME_CONFIG.gravity;
  if (newPlayer.vy > GAME_CONFIG.maxVelocityY) {
    newPlayer.vy = GAME_CONFIG.maxVelocityY;
  }

  // 위치 업데이트
  newPlayer.x += newPlayer.vx;
  newPlayer.y += newPlayer.vy;

  // 속도 감속
  newPlayer.vx *= 0.9;

  // 화면 밖으로 나가지 않게
  if (newPlayer.x < 0) newPlayer.x = 0;
  if (newPlayer.x > GAME_CONFIG.goalX + 200) {
    newPlayer.x = GAME_CONFIG.goalX + 200;
  }

  // 바닥 아래로 떨어지면 게임 오버
  if (newPlayer.y > GAME_CONFIG.height + 100) {
    newState.lives -= 1;
    if (newState.lives <= 0) {
      newState.gameOver = true;
    } else {
      // 리스폰
      newPlayer.x = 100;
      newPlayer.y = 300;
      newPlayer.vx = 0;
      newPlayer.vy = 0;
      newState.cameraX = 0;
    }
  }

  newPlayer.onGround = false;

  // 플랫폼 충돌 체크
  newState.platforms.forEach((platform) => {
    if (checkCollision(newPlayer, platform)) {
      // 위에서 떨어지는 경우
      if (newPlayer.vy > 0 && newPlayer.y + newPlayer.height - newPlayer.vy <= platform.y) {
        newPlayer.y = platform.y - newPlayer.height;
        newPlayer.vy = 0;
        newPlayer.onGround = true;
      }
      // 아래에서 부딪치는 경우
      else if (newPlayer.vy < 0 && newPlayer.y - newPlayer.vy >= platform.y + platform.height) {
        newPlayer.y = platform.y + platform.height;
        newPlayer.vy = 0;
      }
      // 옆에서 부딪치는 경우
      else {
        if (newPlayer.vx > 0) {
          newPlayer.x = platform.x - newPlayer.width;
        } else if (newPlayer.vx < 0) {
          newPlayer.x = platform.x + platform.width;
        }
        newPlayer.vx = 0;
      }
    }
  });

  newState.player = newPlayer;

  // 카메라 업데이트 (플레이어를 화면 중앙에 유지)
  const targetCameraX = newPlayer.x - GAME_CONFIG.width / 3;
  newState.cameraX = Math.max(0, Math.min(targetCameraX, GAME_CONFIG.goalX - GAME_CONFIG.width + 200));

  return newState;
};

// 적 업데이트
export const updateEnemies = (state: GameState): GameState => {
  const newEnemies = state.enemies.map((enemy) => {
    if (!enemy.alive) return enemy;

    const newEnemy = { ...enemy };
    newEnemy.x += newEnemy.vx;

    // 플랫폼 가장자리에서 방향 전환
    let onPlatform = false;
    state.platforms.forEach((platform) => {
      if (
        newEnemy.y + newEnemy.height >= platform.y &&
        newEnemy.y + newEnemy.height <= platform.y + 10 &&
        newEnemy.x + newEnemy.width > platform.x &&
        newEnemy.x < platform.x + platform.width
      ) {
        onPlatform = true;
      }
    });

    // 플랫폼 끝에 도달하면 방향 전환
    if (!onPlatform || newEnemy.x < 0) {
      newEnemy.vx *= -1;
    }

    return newEnemy;
  });

  return { ...state, enemies: newEnemies };
};

// 충돌 감지
export const checkCollisions = (state: GameState): GameState => {
  let newState = { ...state };
  const player = newState.player;

  // 코인 수집
  newState.coins = newState.coins.map((coin) => {
    if (coin.collected) return coin;

    const distance = Math.sqrt(
      Math.pow(player.x + player.width / 2 - coin.x, 2) +
        Math.pow(player.y + player.height / 2 - coin.y, 2)
    );

    if (distance < 30) {
      newState.score += 10;
      return { ...coin, collected: true };
    }
    return coin;
  });

  // 적 충돌
  newState.enemies = newState.enemies.map((enemy) => {
    if (!enemy.alive) return enemy;

    if (checkCollision(player, enemy)) {
      // 위에서 밟은 경우
      if (player.vy > 0 && player.y + player.height - player.vy <= enemy.y + 10) {
        newState.player.vy = -10; // 점프
        newState.score += 20;
        return { ...enemy, alive: false };
      }
      // 옆에서 부딪친 경우 - 데미지
      else {
        newState.lives -= 1;
        if (newState.lives <= 0) {
          newState.gameOver = true;
        } else {
          // 넉백
          newState.player.x = player.x - 50;
          newState.player.vy = -8;
        }
      }
    }
    return enemy;
  });

  // 골 도달 체크
  if (player.x >= GAME_CONFIG.goalX) {
    newState.won = true;
    newState.score += 100;
  }

  return newState;
};

// 충돌 체크 헬퍼
function checkCollision(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

// 이모지 가져오기
export const getPlayerEmoji = (player: Player): string => {
  if (!player.onGround) return player.facingRight ? '🏃‍♂️' : '🏃';
  return player.facingRight ? '🚶‍♂️' : '🚶';
};

export const getEnemyEmoji = (type: string): string => {
  return type === 'goomba' ? '👾' : '🐢';
};

export const getPlatformColor = (type: string): string => {
  switch (type) {
    case 'ground':
      return '#8B4513';
    case 'brick':
      return '#DC143C';
    case 'question':
      return '#FFD700';
    default:
      return '#666';
  }
};
