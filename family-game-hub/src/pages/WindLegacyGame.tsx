import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { AdSense } from '../components/common/AdSense';
import { soundManager } from '../utils/sound';
import {
  createInitialState,
  movePlayer,
  jumpPlayer,
  airDash,
  createEchoClone,
  purifyEnemy,
  rewindTime,
  updatePhysics,
  updateMovingPlatforms,
  updateEnemies,
  checkPressurePlates,
  updateDoors,
  checkCollisions,
  recordHistory,
  rechargeRewindEnergy,
  getPlayerEmoji,
  getEnemyEmoji,
  getPlatformColor,
  GAME_CONFIG,
  type GameState,
} from '../utils/windlegacy';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';

export const WindLegacyGame = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const keysPressed = useRef<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [gameSize, setGameSize] = useState({ width: 1000, height: 600 });
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 조이스틱 상태
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickBase, setJoystickBase] = useState({ x: 0, y: 0 });
  const [joystickStick, setJoystickStick] = useState({ x: 0, y: 0 });
  const [currentDirection, setCurrentDirection] = useState<'left' | 'right' | null>(null);

  const { addRecord } = useGameStore();
  const { currentProfileId } = useProfileStore();

  // 모바일 감지 및 게임 크기 조정
  useEffect(() => {
    const updateSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const mobile = screenWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        const maxWidth = screenWidth - 32;
        const maxHeight = screenHeight - 350;
        const scale = Math.min(maxWidth / 1000, maxHeight / 600);
        setGameSize({
          width: 1000 * scale,
          height: 600 * scale,
        });
      } else {
        setGameSize({ width: 1000, height: 600 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 게임 시작
  const startGame = useCallback(() => {
    soundManager.playClick();
    const initialState = createInitialState(1);
    setGameState(initialState);
    setShowInstructions(false);
    setIsPaused(false);
  }, []);

  // 게임 루프
  useEffect(() => {
    if (!gameState || gameState.gameOver || gameState.won || isPaused) return;

    const gameLoop = setInterval(() => {
      setGameState((prevState) => {
        if (!prevState) return prevState;

        let newState = { ...prevState };

        // 플레이어 이동
        if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a') || currentDirection === 'left') {
          newState = movePlayer(newState, 'left');
        }
        if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d') || currentDirection === 'right') {
          newState = movePlayer(newState, 'right');
        }

        // 물리 업데이트
        newState = updatePhysics(newState);

        // 이동 플랫폼 업데이트
        newState = updateMovingPlatforms(newState);

        // 적 업데이트
        newState = updateEnemies(newState);

        // 압력판 체크
        newState = checkPressurePlates(newState);

        // 문 업데이트
        newState = updateDoors(newState);

        // 충돌 감지
        newState = checkCollisions(newState);

        // 히스토리 기록
        newState = recordHistory(newState);

        // 되감기 에너지 회복
        newState = rechargeRewindEnergy(newState);

        return newState;
      });
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [isPaused, currentProfileId, currentDirection, gameState?.gameOver, gameState?.won]);

  // 키보드 입력
  useEffect(() => {
    if (!gameState || showInstructions) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());

      // 점프
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && gameState.player.onGround) {
        setGameState((prev) => (prev ? jumpPlayer(prev) : prev));
        soundManager.playClick();
      }

      // 공중 대시
      if (e.key === 'Shift' && gameState.abilities.airDash) {
        setGameState((prev) => (prev ? airDash(prev) : prev));
      }

      // 메아리 분신
      if (e.key === 'e' || e.key === 'E') {
        setGameState((prev) => (prev ? createEchoClone(prev) : prev));
        soundManager.playClick();
      }

      // 정화 (가장 가까운 적)
      if (e.key === 'f' || e.key === 'F') {
        const nearestEnemyIndex = findNearestEnemy(gameState);
        if (nearestEnemyIndex !== -1) {
          setGameState((prev) => (prev ? purifyEnemy(prev, nearestEnemyIndex) : prev));
          soundManager.playClick();
        }
      }

      // 시간 되감기
      if (e.key === 'r' || e.key === 'R') {
        setGameState((prev) => (prev ? rewindTime(prev) : prev));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, showInstructions]);

  // 가장 가까운 적 찾기
  const findNearestEnemy = (state: GameState): number => {
    let nearestIndex = -1;
    let minDistance = 150; // 최대 정화 범위

    for (let i = 0; i < state.enemies.length; i++) {
      const enemy = state.enemies[i];
      if (!enemy.alive || enemy.purified) continue;

      const dx = state.player.x - enemy.x;
      const dy = state.player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    return nearestIndex;
  };

  // 조이스틱 터치 시작
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = gameContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // 화면 왼쪽 절반만 조이스틱
    if (x < rect.width / 2) {
      setJoystickActive(true);
      setJoystickBase({ x, y });
      setJoystickStick({ x, y });
    }
  };

  // 조이스틱 터치 이동
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!joystickActive) return;

    const touch = e.touches[0];
    const rect = gameContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const dx = x - joystickBase.x;
    const dy = y - joystickBase.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 50;

    let stickX = x;
    let stickY = y;

    if (distance > maxDistance) {
      const angle = Math.atan2(dy, dx);
      stickX = joystickBase.x + Math.cos(angle) * maxDistance;
      stickY = joystickBase.y + Math.sin(angle) * maxDistance;
    }

    setJoystickStick({ x: stickX, y: stickY });

    // 방향 결정
    if (Math.abs(dx) > 10) {
      setCurrentDirection(dx > 0 ? 'right' : 'left');
    } else {
      setCurrentDirection(null);
    }
  };

  // 조이스틱 터치 종료
  const handleTouchEnd = () => {
    setJoystickActive(false);
    setCurrentDirection(null);
  };

  // 모바일 버튼 핸들러
  const handleMobileJump = () => {
    if (gameState?.player.onGround) {
      setGameState((prev) => (prev ? jumpPlayer(prev) : prev));
      soundManager.playClick();
    }
  };

  const handleMobileDash = () => {
    if (gameState?.abilities.airDash) {
      setGameState((prev) => (prev ? airDash(prev) : prev));
    }
  };

  const handleMobileEcho = () => {
    setGameState((prev) => (prev ? createEchoClone(prev) : prev));
    soundManager.playClick();
  };

  const handleMobilePurify = () => {
    if (!gameState) return;
    const nearestEnemyIndex = findNearestEnemy(gameState);
    if (nearestEnemyIndex !== -1) {
      setGameState((prev) => (prev ? purifyEnemy(prev, nearestEnemyIndex) : prev));
      soundManager.playClick();
    }
  };

  const handleMobileRewind = () => {
    setGameState((prev) => (prev ? rewindTime(prev) : prev));
  };

  // 게임 종료 처리
  useEffect(() => {
    if (gameState?.won && currentProfileId) {
      addRecord({
        profileId: currentProfileId,
        gameType: 'memory',
        difficulty: 'medium',
        score: gameState.score,
        time: 0,
        completedAt: Date.now(),
      });
      soundManager.playClick();
    }
  }, [gameState?.won, currentProfileId, addRecord, gameState?.score]);

  // Canvas 렌더링
  useEffect(() => {
    if (!gameState || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#87CEEB'; // 하늘색 배경
    ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);

    // 카메라 오프셋
    ctx.save();
    ctx.translate(-gameState.cameraX, 0);

    // 플랫폼 그리기
    for (const platform of gameState.platforms) {
      ctx.fillStyle = getPlatformColor(platform.type);
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

      // 바람 발판 표시
      if (platform.type === 'wind') {
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('💨', platform.x + 20, platform.y + 15);
      }
    }

    // 압력판 그리기
    for (const plate of gameState.pressurePlates) {
      ctx.fillStyle = plate.activated ? '#00FF00' : '#FF0000';
      ctx.fillRect(plate.x, plate.y, plate.width, plate.height);
    }

    // 문 그리기
    for (const door of gameState.doors) {
      if (!door.open) {
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(door.x, door.y, door.width, door.height);
      }
    }

    // 깃털 그리기
    for (const feather of gameState.feathers) {
      if (!feather.collected) {
        ctx.fillStyle = '#FFD700';
        ctx.font = '20px Arial';
        ctx.fillText('🪶', feather.x, feather.y);
      }
    }

    // 적 그리기
    for (const enemy of gameState.enemies) {
      if (enemy.alive) {
        ctx.font = '24px Arial';
        ctx.fillText(getEnemyEmoji(enemy), enemy.x, enemy.y + 24);

        // 정화 타이머 표시
        if (enemy.purified) {
          ctx.fillStyle = 'white';
          ctx.font = '12px Arial';
          ctx.fillText(`${Math.ceil(enemy.purifyTimer / 60)}s`, enemy.x, enemy.y - 5);
        }
      }
    }

    // 메아리 분신 그리기
    for (const echo of gameState.echoClones) {
      if (echo.active) {
        ctx.globalAlpha = 0.5;
        ctx.font = '28px Arial';
        ctx.fillText('👤', echo.x, echo.y + 28);
        ctx.globalAlpha = 1.0;
      }
    }

    // 플레이어 그리기
    const player = gameState.player;
    ctx.font = '28px Arial';
    const emoji = getPlayerEmoji(player);
    if (!player.facingRight) {
      ctx.save();
      ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
      ctx.scale(-1, 1);
      ctx.fillText(emoji, -player.width / 2, player.height / 2);
      ctx.restore();
    } else {
      ctx.fillText(emoji, player.x, player.y + 28);
    }

    ctx.restore();

    // UI 정보
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(`점수: ${gameState.score}`, 20, 30);
    ctx.fillText(`깃털: ${gameState.feathersCollected}`, 20, 55);

    // 되감기 에너지 바
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(20, 70, 200, 20);
    ctx.fillStyle = gameState.rewindEnergy > 30 ? '#00FFFF' : '#FF0000';
    ctx.fillRect(20, 70, (gameState.rewindEnergy / 100) * 200, 20);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(20, 70, 200, 20);
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText('되감기 에너지', 25, 85);

    // 능력 아이콘
    let abilityY = 110;
    ctx.font = '14px Arial';
    if (gameState.abilities.airDash) {
      ctx.fillText('💨 공중대시 (Shift)', 20, abilityY);
      abilityY += 20;
    }
    if (gameState.abilities.windBoost) {
      ctx.fillText('🌪️ 바람도약 (바람발판)', 20, abilityY);
      abilityY += 20;
    }
    if (gameState.abilities.dualEcho) {
      ctx.fillText('👥 이중메아리 (E x2)', 20, abilityY);
      abilityY += 20;
    }
    if (gameState.abilities.spiritRide) {
      ctx.fillText('👻 정령타기 (위에서 밟기)', 20, abilityY);
    }

  }, [gameState]);

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-8">
        <Header title="바람의 유산" />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-indigo-800">
              바람의 유산: 자하라의 메아리
            </h2>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-blue-900">🎮 게임 소개</h3>
              <p className="text-gray-700 leading-relaxed">
                고대 도시 자하라를 뒤덮은 침묵의 안개를 걷어내기 위한 모험!
                시간을 되감고, 메아리 분신을 만들어 퍼즐을 풀고, 타락한 정령들을 정화하세요.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 text-indigo-800">⌨️ 조작법 (키보드)</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>←/→ 또는 A/D</strong>: 좌우 이동</li>
                <li>• <strong>스페이스 또는 ↑/W</strong>: 점프</li>
                <li>• <strong>Shift</strong>: 공중 대시 (공중에서)</li>
                <li>• <strong>E</strong>: 메아리 분신 생성 (압력판용)</li>
                <li>• <strong>F</strong>: 정화의 피리 (가까운 적 정화)</li>
                <li>• <strong>R</strong>: 시간 되감기 (에너지 소모)</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 text-indigo-800">📱 조작법 (모바일)</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>화면 왼쪽 드래그</strong>: 조이스틱으로 이동</li>
                <li>• <strong>점프 버튼</strong>: 점프</li>
                <li>• <strong>대시 버튼</strong>: 공중 대시</li>
                <li>• <strong>메아리 버튼</strong>: 분신 생성</li>
                <li>• <strong>정화 버튼</strong>: 적 정화</li>
                <li>• <strong>되감기 버튼</strong>: 시간 되감기</li>
              </ul>
            </div>

            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-yellow-900">🎯 게임 목표</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 🪶 깃털을 수집하여 새로운 능력 해금</li>
                <li>• 압력판을 눌러 문을 열기 (메아리 분신 활용)</li>
                <li>• 적은 정화하여 플랫폼으로 활용</li>
                <li>• 실수하면 시간을 되감아 재도전</li>
                <li>• 오른쪽 끝 골 지점에 도달하면 승리!</li>
              </ul>
            </div>

            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-green-900">⭐ 능력 해금</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• 깃털 3개: 🌪️ 바람 도약 (바람 발판에서 높이 뛰기)</li>
                <li>• 깃털 6개: 👥 이중 메아리 (분신 2개 동시 설치)</li>
                <li>• 깃털 9개: 👻 정령 타기 (정화된 적을 밟고 높이 뛰기)</li>
              </ul>
            </div>

            <Button onClick={startGame} className="w-full py-4 text-lg">
              게임 시작
            </Button>
          </div>

          <AdSense />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-8">
      <Header title="바람의 유산" />
      <main className="container mx-auto px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-800">바람의 유산</h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsPaused(!isPaused)}
                  variant="secondary"
                  className="px-4 py-2"
                >
                  {isPaused ? '계속' : '일시정지'}
                </Button>
                <Button
                  onClick={() => {
                    setShowInstructions(true);
                    setGameState(null);
                  }}
                  variant="secondary"
                  className="px-4 py-2"
                >
                  처음으로
                </Button>
              </div>
            </div>

            {/* 게임 캔버스 */}
            <div
              ref={gameContainerRef}
              className="relative mx-auto bg-black rounded-lg overflow-hidden"
              style={{
                width: `${gameSize.width}px`,
                height: `${gameSize.height}px`,
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <canvas
                ref={canvasRef}
                width={GAME_CONFIG.width}
                height={GAME_CONFIG.height}
                className="w-full h-full"
              />

              {/* 조이스틱 표시 (모바일) */}
              {isMobile && joystickActive && (
                <>
                  <div
                    className="absolute w-20 h-20 rounded-full bg-white opacity-30"
                    style={{
                      left: `${(joystickBase.x / gameSize.width) * 100}%`,
                      top: `${(joystickBase.y / gameSize.height) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                  <div
                    className="absolute w-10 h-10 rounded-full bg-blue-500 opacity-70"
                    style={{
                      left: `${(joystickStick.x / gameSize.width) * 100}%`,
                      top: `${(joystickStick.y / gameSize.height) * 100}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </>
              )}

              {/* 게임 오버 오버레이 */}
              {gameState?.gameOver && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="bg-white p-8 rounded-lg text-center max-w-md">
                    <h3 className="text-3xl font-bold text-red-600 mb-4">💀 게임 오버</h3>
                    <p className="text-gray-700 mb-2">시간을 되감아보는 건 어떨까요?</p>
                    <p className="text-gray-600 mb-4">점수: {gameState.score}</p>
                    <Button onClick={startGame} className="w-full">
                      다시 시작
                    </Button>
                  </div>
                </div>
              )}

              {/* 승리 오버레이 */}
              {gameState?.won && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="bg-white p-8 rounded-lg text-center max-w-md">
                    <h3 className="text-3xl font-bold text-green-600 mb-4">🎉 스테이지 클리어!</h3>
                    <p className="text-gray-700 mb-2">자하라에 평화가 찾아왔습니다!</p>
                    <p className="text-gray-600 mb-4">최종 점수: {gameState.score}</p>
                    <p className="text-gray-600 mb-4">수집한 깃털: {gameState.feathersCollected}/3</p>
                    <Button onClick={startGame} className="w-full">
                      다시 도전
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 모바일 컨트롤 버튼 */}
            {isMobile && gameState && !gameState.gameOver && !gameState.won && (
              <div className="mt-4 space-y-2">
                {/* 첫 번째 줄: 이동 관련 */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleMobileJump}
                    className="flex-1 py-4 text-xl font-bold"
                    disabled={!gameState.player.onGround}
                  >
                    ⬆️ 점프
                  </Button>
                  <Button
                    onClick={handleMobileDash}
                    className="flex-1 py-4 text-xl font-bold"
                    variant="secondary"
                    disabled={!gameState.abilities.airDash || !gameState.player.canAirDash || gameState.player.dashCooldown > 0}
                  >
                    💨 대시
                  </Button>
                </div>

                {/* 두 번째 줄: 능력 */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleMobileEcho}
                    className="flex-1 py-4 text-xl font-bold"
                    variant="secondary"
                  >
                    👤 메아리
                  </Button>
                  <Button
                    onClick={handleMobilePurify}
                    className="flex-1 py-4 text-xl font-bold"
                    variant="secondary"
                  >
                    😇 정화
                  </Button>
                  <Button
                    onClick={handleMobileRewind}
                    className="flex-1 py-4 text-xl font-bold"
                    variant="secondary"
                    disabled={gameState.rewindEnergy < 30}
                  >
                    ⏪ 되감기
                  </Button>
                </div>
              </div>
            )}
          </div>

          <AdSense />
        </div>
      </main>
    </div>
  );
};
