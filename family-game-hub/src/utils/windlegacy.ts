// 바람의 유산: 자하라의 메아리 - 2D 플랫포머 게임 로직

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
    canAirDash: boolean; // 공중 대시 가능 여부
    dashCooldown: number; // 대시 쿨다운
    onWindPlatform: boolean; // 바람 발판 위에 있는지
  };

export type Platform = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'floating' | 'moving' | 'wind'; // wind = 바람 발판
  movingPattern?: {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
    speed: number;
    direction: 1 | -1;
  };
};

export type PressurePlate = {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  activated: boolean;
  linkedDoorId?: string;
};

export type Door = {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  open: boolean;
  requiredPlates: string[]; // 열려면 필요한 압력판 ID들
};

export type Enemy = Position & {
  width: number;
  height: number;
  vx: number;
  alive: boolean;
  purified: boolean; // 정화 여부
  purifyTimer: number; // 정화 지속 시간
  type: 'patrol' | 'chase'; // 순찰형 / 추적형
  patrolStart?: number;
  patrolEnd?: number;
};

export type EchoClone = Position & {
  id: string;
  active: boolean;
  width: number;
  height: number;
};

export type Feather = Position & {
  collected: boolean;
};

export type HistoryFrame = {
  player: Player;
  timestamp: number;
};

export type GameState = {
  player: Player;
  platforms: Platform[];
  pressurePlates: PressurePlate[];
  doors: Door[];
  enemies: Enemy[];
  echoClones: EchoClone[];
  feathers: Feather[];

  // 게임 상태
  score: number;
  feathersCollected: number;
  stage: number;
  gameOver: boolean;
  won: boolean;
  cameraX: number;

  // 능력 시스템
  abilities: {
    airDash: boolean; // 공중 대시 (시작부터 보유)
    windBoost: boolean; // 바람 도약 (깃털 3개)
    dualEcho: boolean; // 이중 메아리 (깃털 6개)
    spiritRide: boolean; // 정령 타기 (깃털 9개)
  };

  // 시간 되감기
  timeRewindAvailable: boolean;
  rewindEnergy: number; // 0-100
  history: HistoryFrame[];

  // 메아리 시스템
  maxEchoClones: number; // 1 or 2 (능력 업그레이드)
};

export const GAME_CONFIG = {
  width: 1000,
  height: 600,
  gravity: 0.6,
  jumpPower: -14,
  moveSpeed: 4.5,
  maxVelocityY: 18,
  playerWidth: 28,
  playerHeight: 36,
  enemyWidth: 30,
  enemyHeight: 30,
  featherSize: 16,

  // 능력 관련
  dashSpeed: 12,
  dashDuration: 10, // 프레임
  windBoostPower: -22,
  purifyDuration: 180, // 3초 (60fps)

  // 시간 되감기
  historyMaxFrames: 600, // 10초분 (60fps)
  rewindRechargeRate: 0.2, // 프레임당 회복
};

export const createInitialState = (stage: number = 1): GameState => {
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
      canAirDash: true,
      dashCooldown: 0,
      onWindPlatform: false,
    },
    platforms: createStagePlatforms(stage),
    pressurePlates: createStagePressurePlates(stage),
    doors: createStageDoors(stage),
    enemies: createStageEnemies(stage),
    echoClones: [],
    feathers: createStageFeathers(stage),
    score: 0,
    feathersCollected: 0,
    stage,
    gameOver: false,
    won: false,
    cameraX: 0,
    abilities: {
      airDash: true, // 시작부터 보유
      windBoost: false,
      dualEcho: false,
      spiritRide: false,
    },
    timeRewindAvailable: true,
    rewindEnergy: 100,
    history: [],
    maxEchoClones: 1,
  };
};

// Stage 1: 튜토리얼 - 기본 이동과 점프 학습
function createStagePlatforms(stage: number): Platform[] {
  const platforms: Platform[] = [];

  if (stage === 1) {
    // 바닥
    platforms.push({ x: 0, y: 550, width: 2000, height: 50, type: 'ground' });

    // 기본 플랫폼들
    platforms.push({ x: 300, y: 450, width: 100, height: 20, type: 'floating' });
    platforms.push({ x: 500, y: 380, width: 100, height: 20, type: 'floating' });
    platforms.push({ x: 700, y: 320, width: 100, height: 20, type: 'floating' });
    platforms.push({ x: 900, y: 260, width: 120, height: 20, type: 'floating' });

    // 첫 번째 바람 발판 (능력 학습용)
    platforms.push({ x: 1100, y: 450, width: 60, height: 20, type: 'wind' });

    // 이동 플랫폼
    platforms.push({
      x: 1300,
      y: 400,
      width: 80,
      height: 20,
      type: 'moving',
      movingPattern: {
        startX: 1300,
        endX: 1300,
        startY: 300,
        endY: 500,
        speed: 2,
        direction: 1,
      },
    });

    // 골 지점 플랫폼
    platforms.push({ x: 1600, y: 200, width: 200, height: 20, type: 'floating' });
  }

  return platforms;
}

function createStagePressurePlates(stage: number): PressurePlate[] {
  const plates: PressurePlate[] = [];

  if (stage === 1) {
    // 튜토리얼: 메아리 분신 학습용 압력판
    plates.push({
      x: 1100,
      y: 530,
      width: 40,
      height: 20,
      id: 'plate1',
      activated: false,
      linkedDoorId: 'door1',
    });

    plates.push({
      x: 1500,
      y: 530,
      width: 40,
      height: 20,
      id: 'plate2',
      activated: false,
      linkedDoorId: 'door1',
    });
  }

  return plates;
}

function createStageDoors(stage: number): Door[] {
  const doors: Door[] = [];

  if (stage === 1) {
    // 튜토리얼: 두 개의 압력판을 동시에 눌러야 열리는 문
    doors.push({
      x: 1600,
      y: 220,
      width: 20,
      height: 180,
      id: 'door1',
      open: false,
      requiredPlates: ['plate1', 'plate2'],
    });
  }

  return doors;
}

function createStageEnemies(stage: number): Enemy[] {
  const enemies: Enemy[] = [];

  if (stage === 1) {
    // 순찰형 적
    enemies.push({
      x: 600,
      y: 520,
      width: GAME_CONFIG.enemyWidth,
      height: GAME_CONFIG.enemyHeight,
      vx: 1.5,
      alive: true,
      purified: false,
      purifyTimer: 0,
      type: 'patrol',
      patrolStart: 500,
      patrolEnd: 800,
    });

    enemies.push({
      x: 1000,
      y: 520,
      width: GAME_CONFIG.enemyWidth,
      height: GAME_CONFIG.enemyHeight,
      vx: 2,
      alive: true,
      purified: false,
      purifyTimer: 0,
      type: 'patrol',
      patrolStart: 900,
      patrolEnd: 1200,
    });
  }

  return enemies;
}

function createStageFeathers(stage: number): Feather[] {
  const feathers: Feather[] = [];

  if (stage === 1) {
    feathers.push({ x: 550, y: 350, collected: false });
    feathers.push({ x: 950, y: 230, collected: false });
    feathers.push({ x: 1700, y: 170, collected: false });
  }

  return feathers;
}

// 플레이어 이동
export const movePlayer = (state: GameState, direction: 'left' | 'right'): GameState => {
  const newState = { ...state };
  const player = { ...newState.player };

  if (direction === 'left') {
    player.vx = -GAME_CONFIG.moveSpeed;
    player.facingRight = false;
  } else {
    player.vx = GAME_CONFIG.moveSpeed;
    player.facingRight = true;
  }

  newState.player = player;
  return newState;
};

// 플레이어 점프
export const jumpPlayer = (state: GameState): GameState => {
  const newState = { ...state };
  const player = { ...newState.player };

  if (player.onGround) {
    // 바람 발판에서 점프하면 더 높이 뛰기
    if (player.onWindPlatform && state.abilities.windBoost) {
      player.vy = GAME_CONFIG.windBoostPower;
    } else {
      player.vy = GAME_CONFIG.jumpPower;
    }
    player.onGround = false;
  }

  newState.player = player;
  return newState;
};

// 공중 대시
export const airDash = (state: GameState): GameState => {
  if (!state.abilities.airDash || !state.player.canAirDash || state.player.dashCooldown > 0) {
    return state;
  }

  const newState = { ...state };
  const player = { ...newState.player };

  const dashVx = player.facingRight ? GAME_CONFIG.dashSpeed : -GAME_CONFIG.dashSpeed;
  player.vx = dashVx;
  player.vy = 0; // 대시 중에는 중력 무시
  player.canAirDash = false;
  player.dashCooldown = GAME_CONFIG.dashDuration;

  newState.player = player;
  return newState;
};

// 메아리 분신 생성
export const createEchoClone = (state: GameState): GameState => {
  if (state.echoClones.filter(e => e.active).length >= state.maxEchoClones) {
    return state; // 최대 개수 제한
  }

  const newState = { ...state };
  const newEcho: EchoClone = {
    x: state.player.x,
    y: state.player.y,
    width: state.player.width,
    height: state.player.height,
    id: `echo_${Date.now()}`,
    active: true,
  };

  newState.echoClones = [...state.echoClones, newEcho];
  return newState;
};

// 메아리 분신 제거
export const removeEchoClone = (state: GameState, echoId: string): GameState => {
  const newState = { ...state };
  newState.echoClones = state.echoClones.filter(e => e.id !== echoId);
  return newState;
};

// 적 정화
export const purifyEnemy = (state: GameState, enemyIndex: number): GameState => {
  const newState = { ...state };
  const enemies = [...state.enemies];

  if (enemies[enemyIndex] && !enemies[enemyIndex].purified) {
    enemies[enemyIndex] = {
      ...enemies[enemyIndex],
      purified: true,
      purifyTimer: GAME_CONFIG.purifyDuration,
      vx: 0, // 정화되면 멈춤
    };
  }

  newState.enemies = enemies;
  return newState;
};

// 시간 되감기
export const rewindTime = (state: GameState, frames: number = 180): GameState => {
  if (!state.timeRewindAvailable || state.rewindEnergy < 30 || state.history.length === 0) {
    return state;
  }

  const targetIndex = Math.max(0, state.history.length - frames);
  const targetFrame = state.history[targetIndex];

  const newState = { ...state };
  newState.player = { ...targetFrame.player };
  newState.history = state.history.slice(0, targetIndex);
  newState.rewindEnergy = Math.max(0, state.rewindEnergy - 30);

  return newState;
};

// 물리 엔진 업데이트
export const updatePhysics = (state: GameState): GameState => {
  let newState = { ...state };
  let player = { ...newState.player };

  // 대시 쿨다운
  if (player.dashCooldown > 0) {
    player.dashCooldown--;
    if (player.dashCooldown === 0) {
      player.vx *= 0.5; // 대시 종료 후 감속
    }
  }

  // 중력 적용 (대시 중이 아닐 때만)
  if (player.dashCooldown === 0) {
    player.vy += GAME_CONFIG.gravity;
    if (player.vy > GAME_CONFIG.maxVelocityY) {
      player.vy = GAME_CONFIG.maxVelocityY;
    }
  }

  // 위치 업데이트
  player.x += player.vx;
  player.y += player.vy;

  // 마찰
  if (player.onGround && player.dashCooldown === 0) {
    player.vx *= 0.8;
    if (Math.abs(player.vx) < 0.1) player.vx = 0;
  }

  // 바닥 충돌
  player.onGround = false;
  player.onWindPlatform = false;

  for (const platform of newState.platforms) {
    // 플랫폼 위에서 떨어지는 경우
    if (
      player.vy >= 0 &&
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + 20
    ) {
      player.y = platform.y - player.height;
      player.vy = 0;
      player.onGround = true;
      player.canAirDash = true; // 착지 시 대시 리셋

      // 바람 발판 체크
      if (platform.type === 'wind') {
        player.onWindPlatform = true;
      }
    }
  }

  // 화면 밖으로 떨어진 경우
  if (player.y > GAME_CONFIG.height) {
    newState.gameOver = true;
  }

  // 게임 영역 제한
  if (player.x < 0) player.x = 0;

  newState.player = player;

  // 카메라 이동
  const targetCameraX = player.x - GAME_CONFIG.width / 3;
  newState.cameraX = Math.max(0, targetCameraX);

  return newState;
};

// 이동 플랫폼 업데이트
export const updateMovingPlatforms = (state: GameState): GameState => {
  const newState = { ...state };
  const platforms = [...state.platforms];

  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];
    if (platform.type === 'moving' && platform.movingPattern) {
      const pattern = platform.movingPattern;

      // Y축 이동
      platform.y += pattern.speed * pattern.direction;

      if (platform.y >= pattern.endY) {
        platform.y = pattern.endY;
        pattern.direction = -1;
      } else if (platform.y <= pattern.startY) {
        platform.y = pattern.startY;
        pattern.direction = 1;
      }
    }
  }

  newState.platforms = platforms;
  return newState;
};

// 적 AI 업데이트
export const updateEnemies = (state: GameState): GameState => {
  const newState = { ...state };
  const enemies = [...state.enemies];

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    if (!enemy.alive) continue;

    // 정화 타이머
    if (enemy.purified) {
      enemy.purifyTimer--;
      if (enemy.purifyTimer <= 0) {
        enemy.purified = false;
        enemy.vx = enemy.type === 'patrol' ? 1.5 : 0; // 정화 해제
      }
      continue;
    }

    if (enemy.type === 'patrol') {
      // 순찰형: 좌우 왕복
      enemy.x += enemy.vx;

      if (enemy.patrolStart !== undefined && enemy.patrolEnd !== undefined) {
        if (enemy.x <= enemy.patrolStart || enemy.x >= enemy.patrolEnd) {
          enemy.vx = -enemy.vx;
        }
      }
    } else if (enemy.type === 'chase') {
      // 추적형: 플레이어 쫓아감
      const dx = state.player.x - enemy.x;
      const distance = Math.abs(dx);

      if (distance < 300) {
        const speed = 2.5;
        enemy.vx = dx > 0 ? speed : -speed;
        enemy.x += enemy.vx;
      }
    }
  }

  newState.enemies = enemies;
  return newState;
};

// 압력판 체크
export const checkPressurePlates = (state: GameState): GameState => {
  const newState = { ...state };
  const plates = [...state.pressurePlates];

  for (let i = 0; i < plates.length; i++) {
    const plate = plates[i];
    let activated = false;

    // 플레이어가 압력판 위에 있는지
    if (
      state.player.x + state.player.width > plate.x &&
      state.player.x < plate.x + plate.width &&
      state.player.y + state.player.height >= plate.y &&
      state.player.y + state.player.height <= plate.y + 10
    ) {
      activated = true;
    }

    // 메아리 분신이 압력판 위에 있는지
    for (const echo of state.echoClones) {
      if (!echo.active) continue;

      if (
        echo.x + echo.width > plate.x &&
        echo.x < plate.x + plate.width &&
        echo.y + echo.height >= plate.y &&
        echo.y + echo.height <= plate.y + 10
      ) {
        activated = true;
        break;
      }
    }

    // 정화된 적이 압력판 위에 있는지
    for (const enemy of state.enemies) {
      if (!enemy.purified) continue;

      if (
        enemy.x + enemy.width > plate.x &&
        enemy.x < plate.x + plate.width &&
        enemy.y + enemy.height >= plate.y &&
        enemy.y + enemy.height <= plate.y + 10
      ) {
        activated = true;
        break;
      }
    }

    plates[i].activated = activated;
  }

  newState.pressurePlates = plates;
  return newState;
};

// 문 상태 업데이트
export const updateDoors = (state: GameState): GameState => {
  const newState = { ...state };
  const doors = [...state.doors];

  for (let i = 0; i < doors.length; i++) {
    const door = doors[i];
    const requiredPlates = door.requiredPlates;

    // 모든 필요한 압력판이 활성화되었는지 확인
    const allActivated = requiredPlates.every(plateId => {
      const plate = state.pressurePlates.find(p => p.id === plateId);
      return plate?.activated || false;
    });

    doors[i].open = allActivated;
  }

  newState.doors = doors;
  return newState;
};

// 충돌 감지
export const checkCollisions = (state: GameState): GameState => {
  let newState = { ...state };
  const player = newState.player;

  // 깃털 수집
  const feathers = [...state.feathers];
  for (let i = 0; i < feathers.length; i++) {
    const feather = feathers[i];
    if (feather.collected) continue;

    const dx = player.x - feather.x;
    const dy = player.y - feather.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 30) {
      feathers[i].collected = true;
      newState.feathersCollected++;
      newState.score += 100;

      // 능력 해금
      if (newState.feathersCollected >= 3 && !newState.abilities.windBoost) {
        newState.abilities.windBoost = true;
      }
      if (newState.feathersCollected >= 6 && !newState.abilities.dualEcho) {
        newState.abilities.dualEcho = true;
        newState.maxEchoClones = 2;
      }
      if (newState.feathersCollected >= 9 && !newState.abilities.spiritRide) {
        newState.abilities.spiritRide = true;
      }
    }
  }
  newState.feathers = feathers;

  // 적과 충돌
  for (let i = 0; i < state.enemies.length; i++) {
    const enemy = state.enemies[i];
    if (!enemy.alive || enemy.purified) continue;

    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      // 정령 타기 능력이 있고, 위에서 떨어지는 경우
      if (state.abilities.spiritRide && player.vy > 0) {
        // 정령을 밟고 높이 뛰기
        newState.player.vy = GAME_CONFIG.jumpPower * 1.5;
      } else {
        // 게임 오버 (대신 시간 되감기 힌트)
        newState.gameOver = true;
      }
    }
  }

  // 닫힌 문과 충돌 (통과 불가)
  for (const door of state.doors) {
    if (door.open) continue;

    if (
      player.x < door.x + door.width &&
      player.x + player.width > door.x &&
      player.y < door.y + door.height &&
      player.y + player.height > door.y
    ) {
      // 문이 닫혀 있으면 플레이어를 밀어냄
      if (player.vx > 0) {
        newState.player.x = door.x - player.width;
      } else {
        newState.player.x = door.x + door.width;
      }
      newState.player.vx = 0;
    }
  }

  // 골 지점 도달
  if (player.x > 1750 && player.y < 250) {
    newState.won = true;
  }

  return newState;
};

// 히스토리 기록
export const recordHistory = (state: GameState): GameState => {
  const newState = { ...state };
  const history = [...state.history];

  history.push({
    player: { ...state.player },
    timestamp: Date.now(),
  });

  // 최대 프레임 제한
  if (history.length > GAME_CONFIG.historyMaxFrames) {
    history.shift();
  }

  newState.history = history;
  return newState;
};

// 되감기 에너지 회복
export const rechargeRewindEnergy = (state: GameState): GameState => {
  const newState = { ...state };

  if (newState.rewindEnergy < 100) {
    newState.rewindEnergy = Math.min(100, newState.rewindEnergy + GAME_CONFIG.rewindRechargeRate);
  }

  return newState;
};

// 이모지 렌더링용
export const getPlayerEmoji = (player: Player): string => {
  if (player.dashCooldown > 0) return '💨'; // 대시 중
  if (!player.onGround) return '🌟'; // 공중
  if (Math.abs(player.vx) > 0.5) return '🏃'; // 달리기
  return '🧘'; // 정지
};

export const getEnemyEmoji = (enemy: Enemy): string => {
  if (enemy.purified) return '😇'; // 정화됨
  return enemy.type === 'patrol' ? '👻' : '👹'; // 순찰 / 추적
};

export const getPlatformColor = (type: Platform['type']): string => {
  switch (type) {
    case 'ground':
      return '#8B7355';
    case 'floating':
      return '#D4AF37';
    case 'moving':
      return '#CD853F';
    case 'wind':
      return '#87CEEB';
    default:
      return '#999';
  }
};
