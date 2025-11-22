# Family Game Hub - 코드 구성

## 📁 프로젝트 구조

```
family-game-hub/
├── src/
│   ├── pages/           # 게임 페이지 컴포넌트
│   ├── components/      # 공통 컴포넌트
│   ├── utils/           # 게임 로직 유틸
│   ├── store/           # 상태 관리 (Zustand)
│   └── App.tsx          # 라우터 설정
├── public/              # 정적 파일
└── package.json         # 의존성
```

---

## 🎮 게임 목록 (19개)

### 액션 게임 (6개)
1. **SnakeGame** - 스네이크 게임
2. **Galaga** - 우주 슈팅
3. **Breakout** - 벽돌깨기
4. **MarioGame** - 슈퍼 점프맨
5. **MazeGame** - 미로 찾기
6. **WindLegacyGame** - 바람의 유산 (퍼즐 플랫포머)

### 퍼즐 게임 (5개)
7. **Game2048** - 2048
8. **Sudoku** - 스도쿠
9. **Minesweeper** - 지뢰찾기
10. **MemoryGame** - 카드 뒤집기
11. **ColoringGame** - 색칠하기

### 교육 게임 (5개)
12. **EnglishWords** - 영어 단어 외우기
13. **EnglishSentences** - 영어 문장 만들기
14. **EnglishQuiz** - 영어 퀴즈
15. **EnglishStorybook** - 영어 동화책
16. **EnglishFlashcards** - 영어 플래시카드

### 퀴즈 게임 (1개)
17. **WorldMapQuiz** - 세계 지도 퀴즈

### 기타 (2개)
18. **Home** - 홈 화면
19. **Profiles** - 프로필 관리

---

## 📂 주요 파일 구조

### 1️⃣ 게임 페이지 패턴
```
src/pages/[GameName].tsx
```
- 게임 UI 렌더링
- 상태 관리 (useState, useEffect)
- 모바일 컨트롤 (터치/조이스틱)
- 게임 루프 (setInterval)

**예시: SnakeGame.tsx**
```typescript
export const SnakeGame = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // 게임 루프
  useEffect(() => {
    const loop = setInterval(() => {
      // 게임 로직 실행
    }, 100);
    return () => clearInterval(loop);
  }, [gameState]);

  // 모바일 컨트롤
  const handleTouchStart = (e: TouchEvent) => { ... };

  return (
    <div>
      {/* 게임 화면 */}
      {/* 모바일 조이스틱 */}
      {/* 컨트롤 버튼 */}
    </div>
  );
};
```

---

### 2️⃣ 게임 로직 유틸
```
src/utils/[gamename].ts
```
- 게임 타입 정의
- 게임 상태 생성
- 게임 로직 함수 (이동, 충돌, 점수 등)

**예시: snake.ts**
```typescript
export type GameState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  gameOver: boolean;
};

export const createInitialState = (): GameState => { ... };
export const moveSnake = (state: GameState): GameState => { ... };
export const checkCollision = (state: GameState): boolean => { ... };
```

---

### 3️⃣ 공통 컴포넌트
```
src/components/common/
├── Button.tsx       # 버튼
├── Card.tsx         # 카드
├── Header.tsx       # 헤더
└── AdSense.tsx      # 광고
```

**재사용 가능한 UI 컴포넌트**

---

### 4️⃣ 상태 관리 (Zustand)
```
src/store/
├── gameStore.ts          # 게임 기록
├── profileStore.ts       # 프로필 관리
├── settingsStore.ts      # 설정
└── voiceSettingsStore.ts # 음성 설정
```

**예시: gameStore.ts**
```typescript
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => { ... },
      getProfileStats: (profileId) => { ... },
    }),
    { name: 'game-store' }
  )
);
```

---

## 🎯 게임별 핵심 특징

### WindLegacyGame (바람의 유산)
```typescript
// 파일: src/utils/windlegacy.ts + src/pages/WindLegacyGame.tsx

핵심 메카닉:
- 시간 되감기 (history 배열 관리)
- 메아리 분신 (EchoClone)
- 적 정화 (purifyEnemy)
- 능력 해금 (깃털 수집)
- 압력판 퍼즐

모바일:
- 조이스틱 (좌우 이동)
- 5개 버튼 (점프, 대시, 메아리, 정화, 되감기)
```

### Galaga (갤러그)
```typescript
// 파일: src/utils/galaga.ts + src/pages/Galaga.tsx

핵심 메카닉:
- 적 웨이브 시스템
- 자동/수동 발사
- 충돌 감지
- 점수 시스템

모바일:
- 터치 드래그 (좌우 이동)
- 자동 발사 토글
```

### SnakeGame
```typescript
// 파일: src/utils/snake.ts + src/pages/SnakeGame.tsx

핵심 메카닉:
- 뱀 이동 (방향 큐)
- 먹이 생성
- 충돌 감지
- 벽 통과

모바일:
- 가상 조이스틱 (8방향)
- 방향 표시기
```

### Game2048
```typescript
// 파일: src/utils/game2048.ts + src/pages/Game2048.tsx

핵심 메카닉:
- 타일 이동 (상하좌우)
- 타일 병합
- 새 타일 생성
- 게임 오버 체크

모바일:
- 스와이프 제스처
- 방향 버튼 (백업)
```

---

## 📱 모바일 최적화 패턴

### 1. 조이스틱 구현
```typescript
const [joystickBase, setJoystickBase] = useState({ x: 0, y: 0 });
const [joystickStick, setJoystickStick] = useState({ x: 0, y: 0 });

const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0];
  setJoystickBase({ x: touch.clientX, y: touch.clientY });
};

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault();
  const dx = touch.clientX - joystickBase.x;
  const dy = touch.clientY - joystickBase.y;
  // 방향 계산
};
```

### 2. 버튼 레이아웃
```typescript
<div className="flex gap-2">
  <Button className="flex-1 py-4 text-xl font-bold">
    ⬆️ 점프
  </Button>
  <Button className="flex-1 py-4 text-xl font-bold">
    💨 대시
  </Button>
</div>
```

### 3. 터치 영역
- 최소 크기: `py-4` (16px 상하 패딩)
- 텍스트: `text-xl` 이상
- 간격: `gap-2` (8px)

---

## 🔧 개발 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 타입 체크
npm run type-check

# 린트
npm run lint
```

---

## 📦 주요 의존성

```json
{
  "react": "^19.0.0",
  "react-router-dom": "^7.1.1",
  "zustand": "^5.0.2",
  "tailwindcss": "^3.4.17",
  "vite": "^7.1.12"
}
```

---

## 🎨 스타일링

- **Tailwind CSS** 사용
- 반응형 디자인 (sm, md, lg)
- 다크모드 미지원 (현재)

---

## 🚀 배포

- **플랫폼**: Netlify
- **브랜치**: `claude/mobile-snake-game-ux-011CUVhuQEuLejKmTzwUr6Tt`
- **빌드**: `npm run build` → `dist/`
- **URL**: family-game-hub.netlify.app

---

## 📊 성능

- **번들 크기**: 549KB (gzip: 154KB)
- **빌드 시간**: ~7초
- **FPS**: 60 (모든 게임)
- **모바일**: iOS/Android 지원

---

## 🔄 최근 업데이트

### 2025-11-22
- ✅ WindLegacyGame 추가 (시간 되감기 퍼즐 플랫포머)
- ✅ 모바일 UX 전면 개선
  - WindLegacy: 버튼 2줄 레이아웃
  - MarioGame: 점프 버튼 추가
- ✅ 미로/갤러그 버그 수정

### 이전
- ✅ MarioGame 추가
- ✅ Breakout 추가
- ✅ 영어 학습 게임 5종 추가
- ✅ 모바일 조이스틱 구현

---

## 👥 팀

- **개발**: Claude Code
- **프로젝트**: Family Game Hub
- **버전**: 1.0.0
