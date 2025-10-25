import { useState, useRef, useEffect } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { soundManager } from '../utils/sound';

// 재미있고 큰 색칠하기 템플릿
const coloringTemplates = [
  {
    id: 'bear',
    name: '곰돌이',
    emoji: '🐻',
    difficulty: '쉬움',
    areas: 15,
    paths: [
      // 얼굴
      { id: 'face', d: 'M 200 200 Q 150 180 140 220 Q 130 280 160 320 Q 200 350 250 350 Q 300 350 340 320 Q 370 280 360 220 Q 350 180 300 200 Q 250 190 200 200 Z', defaultColor: '#D2691E', size: 'big' },
      // 왼쪽 귀
      { id: 'ear-left', d: 'M 160 180 Q 140 160 130 180 Q 120 200 140 210 Q 160 210 170 200 Q 175 190 160 180 Z', defaultColor: '#8B4513', size: 'big' },
      { id: 'ear-left-inner', d: 'M 150 185 m -15, 0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0', defaultColor: '#FFB6C1', size: 'medium' },
      // 오른쪽 귀
      { id: 'ear-right', d: 'M 340 180 Q 360 160 370 180 Q 380 200 360 210 Q 340 210 330 200 Q 325 190 340 180 Z', defaultColor: '#8B4513', size: 'big' },
      { id: 'ear-right-inner', d: 'M 350 185 m -15, 0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0', defaultColor: '#FFB6C1', size: 'medium' },
      // 왼쪽 눈
      { id: 'eye-left', d: 'M 200 240 m -20, 0 a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0', defaultColor: '#FFFFFF', size: 'big' },
      { id: 'pupil-left', d: 'M 200 240 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0', defaultColor: '#000000', size: 'medium' },
      // 오른쪽 눈
      { id: 'eye-right', d: 'M 300 240 m -20, 0 a 20,20 0 1,0 40,0 a 20,20 0 1,0 -40,0', defaultColor: '#FFFFFF', size: 'big' },
      { id: 'pupil-right', d: 'M 300 240 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0', defaultColor: '#000000', size: 'medium' },
      // 코
      { id: 'nose', d: 'M 250 280 Q 230 290 230 310 Q 230 330 250 340 Q 270 330 270 310 Q 270 290 250 280 Z', defaultColor: '#000000', size: 'big' },
      // 입
      { id: 'mouth-left', d: 'M 250 320 Q 220 330 200 320', defaultColor: 'none', stroke: '#000', strokeWidth: '4', size: 'medium' },
      { id: 'mouth-right', d: 'M 250 320 Q 280 330 300 320', defaultColor: 'none', stroke: '#000', strokeWidth: '4', size: 'medium' },
      // 배
      { id: 'belly', d: 'M 220 350 Q 250 380 280 350 Q 300 370 280 390 Q 250 410 220 390 Q 200 370 220 350 Z', defaultColor: '#FFE4C4', size: 'big' },
      // 볼
      { id: 'cheek-left', d: 'M 170 280 m -15, 0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0', defaultColor: '#FFB6C1', size: 'medium' },
      { id: 'cheek-right', d: 'M 330 280 m -15, 0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0', defaultColor: '#FFB6C1', size: 'medium' },
    ],
  },
  {
    id: 'cat',
    name: '고양이',
    emoji: '🐱',
    difficulty: '보통',
    areas: 20,
    paths: [
      // 얼굴
      { id: 'face', d: 'M 250 250 Q 200 220 170 250 Q 150 280 160 320 Q 180 360 220 380 Q 250 390 280 380 Q 320 360 340 320 Q 350 280 330 250 Q 300 220 250 250 Z', defaultColor: '#FFA500', size: 'big' },
      // 왼쪽 귀
      { id: 'ear-left', d: 'M 190 230 L 160 180 L 210 220 Z', defaultColor: '#FF8C00', size: 'big' },
      { id: 'ear-left-inner', d: 'M 185 215 L 170 185 L 200 210 Z', defaultColor: '#FFB6C1', size: 'medium' },
      // 오른쪽 귀
      { id: 'ear-right', d: 'M 310 230 L 340 180 L 290 220 Z', defaultColor: '#FF8C00', size: 'big' },
      { id: 'ear-right-inner', d: 'M 315 215 L 330 185 L 300 210 Z', defaultColor: '#FFB6C1', size: 'medium' },
      // 얼굴 무늬
      { id: 'stripe-1', d: 'M 180 260 Q 200 255 220 260', defaultColor: 'none', stroke: '#FF6347', strokeWidth: '3', size: 'small' },
      { id: 'stripe-2', d: 'M 180 280 Q 200 275 220 280', defaultColor: 'none', stroke: '#FF6347', strokeWidth: '3', size: 'small' },
      { id: 'stripe-3', d: 'M 320 260 Q 300 255 280 260', defaultColor: 'none', stroke: '#FF6347', strokeWidth: '3', size: 'small' },
      { id: 'stripe-4', d: 'M 320 280 Q 300 275 280 280', defaultColor: 'none', stroke: '#FF6347', strokeWidth: '3', size: 'small' },
      // 눈
      { id: 'eye-left', d: 'M 210 280 m -15, 0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0', defaultColor: '#FFFFFF', size: 'big' },
      { id: 'pupil-left', d: 'M 210 280 L 205 270 L 215 270 Z', defaultColor: '#000000', size: 'medium' },
      { id: 'eye-right', d: 'M 290 280 m -15, 0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0', defaultColor: '#FFFFFF', size: 'big' },
      { id: 'pupil-right', d: 'M 290 280 L 285 270 L 295 270 Z', defaultColor: '#000000', size: 'medium' },
      // 코
      { id: 'nose', d: 'M 250 310 L 240 320 L 260 320 Z', defaultColor: '#FF69B4', size: 'medium' },
      // 입
      { id: 'mouth', d: 'M 250 320 L 250 330 M 250 330 Q 230 335 220 330 M 250 330 Q 270 335 280 330', defaultColor: 'none', stroke: '#000', strokeWidth: '3', size: 'medium' },
      // 수염
      { id: 'whisker-1', d: 'M 180 300 L 140 295', defaultColor: 'none', stroke: '#000', strokeWidth: '2', size: 'small' },
      { id: 'whisker-2', d: 'M 180 310 L 140 310', defaultColor: 'none', stroke: '#000', strokeWidth: '2', size: 'small' },
      { id: 'whisker-3', d: 'M 320 300 L 360 295', defaultColor: 'none', stroke: '#000', strokeWidth: '2', size: 'small' },
      { id: 'whisker-4', d: 'M 320 310 L 360 310', defaultColor: 'none', stroke: '#000', strokeWidth: '2', size: 'small' },
    ],
  },
  {
    id: 'dino',
    name: '공룡',
    emoji: '🦖',
    difficulty: '어려움',
    areas: 25,
    paths: [
      // 몸통
      { id: 'body', d: 'M 200 300 Q 180 280 180 250 Q 180 220 200 200 Q 220 180 250 180 Q 280 180 300 200 Q 320 220 320 250 Q 320 280 300 300 L 200 300 Z', defaultColor: '#32CD32', size: 'big' },
      // 머리
      { id: 'head', d: 'M 180 240 Q 150 240 130 260 Q 120 280 130 300 Q 150 310 170 300 Q 180 280 180 260 Z', defaultColor: '#228B22', size: 'big' },
      // 눈
      { id: 'eye', d: 'M 150 270 m -12, 0 a 12,12 0 1,0 24,0 a 12,12 0 1,0 -24,0', defaultColor: '#FFFFFF', size: 'big' },
      { id: 'pupil', d: 'M 150 270 m -6, 0 a 6,6 0 1,0 12,0 a 6,6 0 1,0 -12,0', defaultColor: '#000000', size: 'medium' },
      // 입
      { id: 'mouth', d: 'M 140 290 Q 150 295 160 290', defaultColor: 'none', stroke: '#000', strokeWidth: '3', size: 'medium' },
      // 등의 가시 (5개)
      { id: 'spike-1', d: 'M 210 180 L 200 150 L 220 170 Z', defaultColor: '#FFD700', size: 'medium' },
      { id: 'spike-2', d: 'M 235 180 L 230 145 L 245 170 Z', defaultColor: '#FFD700', size: 'medium' },
      { id: 'spike-3', d: 'M 260 180 L 260 140 L 270 170 Z', defaultColor: '#FFD700', size: 'medium' },
      { id: 'spike-4', d: 'M 285 180 L 290 145 L 295 170 Z', defaultColor: '#FFD700', size: 'medium' },
      { id: 'spike-5', d: 'M 310 190 L 320 160 L 315 185 Z', defaultColor: '#FFD700', size: 'medium' },
      // 배
      { id: 'belly', d: 'M 210 280 Q 250 295 290 280 Q 280 290 250 295 Q 220 290 210 280 Z', defaultColor: '#FFFFE0', size: 'big' },
      // 배 무늬 (3개)
      { id: 'belly-spot-1', d: 'M 230 285 m -8, 0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0', defaultColor: '#FFA500', size: 'medium' },
      { id: 'belly-spot-2', d: 'M 250 288 m -8, 0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0', defaultColor: '#FFA500', size: 'medium' },
      { id: 'belly-spot-3', d: 'M 270 285 m -8, 0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0', defaultColor: '#FFA500', size: 'medium' },
      // 몸 무늬 (5개)
      { id: 'spot-1', d: 'M 210 220 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0', defaultColor: '#006400', size: 'medium' },
      { id: 'spot-2', d: 'M 240 210 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0', defaultColor: '#006400', size: 'medium' },
      { id: 'spot-3', d: 'M 270 215 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0', defaultColor: '#006400', size: 'medium' },
      { id: 'spot-4', d: 'M 220 250 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0', defaultColor: '#006400', size: 'medium' },
      { id: 'spot-5', d: 'M 280 245 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0', defaultColor: '#006400', size: 'medium' },
      // 꼬리
      { id: 'tail', d: 'M 300 270 Q 340 260 360 270 Q 380 280 360 290 Q 340 300 320 290 Z', defaultColor: '#32CD32', size: 'big' },
      { id: 'tail-tip', d: 'M 360 280 m -12, 0 a 12,12 0 1,0 24,0 a 12,12 0 1,0 -24,0', defaultColor: '#FFD700', size: 'medium' },
      // 앞다리
      { id: 'leg-front', d: 'M 210 300 L 210 340 L 230 340 L 230 300 Z', defaultColor: '#228B22', size: 'big' },
      { id: 'foot-front', d: 'M 205 340 L 205 350 L 235 350 L 235 340 Z', defaultColor: '#32CD32', size: 'medium' },
      // 뒷다리
      { id: 'leg-back', d: 'M 270 300 L 270 340 L 290 340 L 290 300 Z', defaultColor: '#228B22', size: 'big' },
      { id: 'foot-back', d: 'M 265 340 L 265 350 L 295 350 L 295 340 Z', defaultColor: '#32CD32', size: 'medium' },
    ],
  },
  {
    id: 'camera',
    name: '내 사진',
    emoji: '📸',
    difficulty: '커스텀',
    areas: 0,
    paths: [],
  },
];

// 색상 팔레트 (더 밝고 재미있는 색상)
const colorPalette = [
  '#FF6B6B', '#FFE66D', '#4ECDC4', '#95E1D3',
  '#FF1744', '#FF9800', '#FFEB3B', '#8BC34A',
  '#4CAF50', '#00BCD4', '#2196F3', '#3F51B5',
  '#9C27B0', '#E91E63', '#F48FB1', '#CE93D8',
  '#90EE90', '#87CEEB', '#FFB6C1', '#DDA0DD',
  '#8B4513', '#A0522D', '#D2691E', '#F4A460',
  '#333333', '#666666', '#999999', '#FFFFFF',
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#FFD700',
];

export const ColoringGame = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorPalette[0]);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [coloredCount, setColoredCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const canvasRef = useRef<SVGSVGElement>(null);

  // 사진 관련 state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const coloringCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모바일 체크
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // 템플릿 선택 시 기본 색상 설정
  useEffect(() => {
    if (selectedTemplate !== null && selectedTemplate < coloringTemplates.length - 1) {
      const template = coloringTemplates[selectedTemplate];
      const defaultColors: Record<string, string> = {};
      template.paths.forEach((path) => {
        defaultColors[path.id] = path.defaultColor;
      });
      setColors(defaultColors);
      setColoredCount(0);
    }
  }, [selectedTemplate]);

  // 파일 선택 (카메라 or 갤러리)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setCapturedImage(imageData);

      // 색칠용 캔버스에 이미지 로드
      const img = new Image();
      img.onload = () => {
        if (coloringCanvasRef.current) {
          const colorCanvas = coloringCanvasRef.current;
          const colorCtx = colorCanvas.getContext('2d');
          if (colorCtx) {
            colorCanvas.width = 500;
            colorCanvas.height = 500;
            colorCtx.drawImage(img, 0, 0, 500, 500);
          }
        }
      };
      img.src = imageData;
    };
    reader.readAsDataURL(file);
  };

  // 캔버스 색칠 (flood fill)
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!coloringCanvasRef.current) return;

    const canvas = coloringCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

    floodFill(ctx, x, y, selectedColor, canvas.width, canvas.height);
    soundManager.playCardFlip();
  };

  // Flood fill 알고리즘
  const floodFill = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    fillColor: string,
    width: number,
    height: number
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    const startPos = (startY * width + startX) * 4;
    const startR = pixels[startPos];
    const startG = pixels[startPos + 1];
    const startB = pixels[startPos + 2];

    const rgb = hexToRgb(fillColor);
    if (!rgb) return;

    if (startR === rgb.r && startG === rgb.g && startB === rgb.b) return;

    const stack: [number, number][] = [[startX, startY]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const pos = (y * width + x) * 4;
      const r = pixels[pos];
      const g = pixels[pos + 1];
      const b = pixels[pos + 2];

      if (Math.abs(r - startR) > 30 || Math.abs(g - startG) > 30 || Math.abs(b - startB) > 30) continue;

      visited.add(key);

      pixels[pos] = rgb.r;
      pixels[pos + 1] = rgb.g;
      pixels[pos + 2] = rgb.b;

      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const handlePathClick = (pathId: string) => {
    const template = coloringTemplates[selectedTemplate!];
    const originalColor = colors[pathId];

    setColors((prev) => ({
      ...prev,
      [pathId]: selectedColor,
    }));

    // 색칠 사운드
    soundManager.playCardFlip();

    // 처음 색칠하는 경우 카운트
    if (originalColor === template.paths.find(p => p.id === pathId)?.defaultColor) {
      const newCount = coloredCount + 1;
      setColoredCount(newCount);

      // 완료 체크
      if (newCount === template.areas) {
        soundManager.playComplete();
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        soundManager.playMatch();
      }
    }
  };

  const handleReset = () => {
    if (capturedImage && coloringCanvasRef.current) {
      const img = new Image();
      img.onload = () => {
        if (coloringCanvasRef.current) {
          const ctx = coloringCanvasRef.current.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 500, 500);
          }
        }
      };
      img.src = capturedImage;
    } else if (selectedTemplate !== null) {
      const template = coloringTemplates[selectedTemplate];
      const defaultColors: Record<string, string> = {};
      template.paths.forEach((path) => {
        defaultColors[path.id] = path.defaultColor;
      });
      setColors(defaultColors);
      setColoredCount(0);
    }
  };

  const handleSave = () => {
    if (capturedImage && coloringCanvasRef.current) {
      const link = document.createElement('a');
      link.download = `coloring-photo-${Date.now()}.png`;
      link.href = coloringCanvasRef.current.toDataURL();
      link.click();
    } else if (canvasRef.current) {
      const svgData = new XMLSerializer().serializeToString(canvasRef.current);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `coloring-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 2000);
  };

  // 모바일 전용 체크
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header title="🎨 색칠하기" showBack />
        <div className="max-w-2xl mx-auto p-4 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-4">
            <div className="text-6xl">📱</div>
            <h2 className="text-2xl font-bold text-textDark">
              모바일 전용 기능
            </h2>
            <p className="text-gray-600">
              색칠하기 게임은 모바일 기기에서만 이용할 수 있습니다.
              <br />
              스마트폰이나 태블릿에서 접속해주세요!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 템플릿 선택 화면
  if (selectedTemplate === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="🎨 색칠하기" showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎨</div>
            <h2 className="text-2xl font-bold text-textDark">
              색칠할 그림을 선택하세요
            </h2>
            <p className="text-gray-600">크고 귀여운 캐릭터를 색칠해보세요!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {coloringTemplates.map((template, index) => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(index);
                }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
              >
                <div className="text-center space-y-2">
                  <div className="text-5xl">{template.emoji}</div>
                  <div className="text-lg font-bold text-textDark">
                    {template.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {template.difficulty}
                    {template.areas > 0 && ` (${template.areas}개 영역)`}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const template = coloringTemplates[selectedTemplate];

  // 사진 선택 모드
  if (template.id === 'camera' && !capturedImage) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="📸 사진 선택" showBack />
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <div className="text-center space-y-4">
            <div className="text-6xl">📸</div>
            <h2 className="text-2xl font-bold text-textDark">
              사진을 선택하세요
            </h2>
            <p className="text-gray-600">
              카메라로 촬영하거나 갤러리에서 선택할 수 있어요!
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              fullWidth
            >
              📷 사진 선택하기
            </Button>
            <Button
              variant="secondary"
              onClick={() => setSelectedTemplate(null)}
              fullWidth
            >
              ← 다른 그림 선택
            </Button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-bold text-textDark mb-2">💡 팁</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 단순한 배경이 색칠하기 쉬워요</li>
              <li>• 명암이 뚜렷한 사진이 좋아요</li>
              <li>• 셀카, 풍경, 사물 모두 가능해요!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 사진 색칠 모드
  if (capturedImage) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header title="🎨 내 사진 색칠하기" showBack />

        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {showSaveMessage && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-success text-textDark px-6 py-3 rounded-full shadow-lg z-50 animate-bounce">
              ✓ 그림이 저장되었어요!
            </div>
          )}

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <canvas
              ref={coloringCanvasRef}
              onClick={handleCanvasClick}
              className="w-full h-auto cursor-crosshair border-2 border-gray-200 rounded-lg"
              style={{ maxHeight: '500px', imageRendering: 'auto' }}
            />
          </div>

          {/* 색상 팔레트 */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-bold text-textDark mb-3">색상 선택</h3>
            <div className="grid grid-cols-8 gap-2">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    soundManager.playCardFlip();
                  }}
                  className={`w-10 h-10 rounded-full transition-all ${
                    selectedColor === color
                      ? 'ring-4 ring-primary scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`색상 ${color}`}
                />
              ))}
            </div>
          </div>

          {/* 버튼들 */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={handleReset} fullWidth>
              🔄 원본으로
            </Button>
            <Button variant="primary" onClick={handleSave} fullWidth>
              💾 저장하기
            </Button>
          </div>

          <Button
            variant="secondary"
            onClick={() => {
              setCapturedImage(null);
              setSelectedTemplate(null);
            }}
            fullWidth
          >
            ← 다른 그림 선택
          </Button>
        </div>
      </div>
    );
  }

  // SVG 템플릿 색칠 모드
  const progress = Math.round((coloredCount / template.areas) * 100);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header
        title={`🎨 ${template.name} 색칠하기`}
        showBack
      />

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 완성 축하 */}
        {showConfetti && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-pulse">
            <div className="bg-white rounded-3xl p-8 shadow-2xl text-center space-y-4">
              <div className="text-8xl animate-bounce">🎉</div>
              <h2 className="text-3xl font-bold text-primary">완성!</h2>
              <p className="text-xl text-textDark">정말 멋져요!</p>
            </div>
          </div>
        )}

        {showSaveMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-success text-textDark px-6 py-3 rounded-full shadow-lg z-50 animate-bounce">
            ✓ 그림이 저장되었어요!
          </div>
        )}

        {/* 진행률 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-textDark">진행률</span>
            <span className="text-2xl font-bold text-primary">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm text-gray-600">
              {coloredCount} / {template.areas} 영역
            </span>
          </div>
        </div>

        {/* SVG 캔버스 - 훨씬 크게! */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <svg
            ref={canvasRef}
            viewBox="100 100 400 400"
            className="w-full h-auto"
            style={{ minHeight: '400px', maxHeight: '600px' }}
          >
            {template.paths.map((path) => (
              <path
                key={path.id}
                d={path.d}
                fill={colors[path.id] || path.defaultColor}
                stroke={'#000'}
                strokeWidth={path.stroke ? '0' : '3'}
                onClick={() => handlePathClick(path.id)}
                className="cursor-pointer hover:opacity-80 transition-all active:scale-95"
                style={{
                  filter: colors[path.id] !== path.defaultColor ? 'drop-shadow(0 0 3px rgba(0,0,0,0.3))' : 'none'
                }}
              />
            ))}
          </svg>
        </div>

        {/* 색상 팔레트 - 더 크게 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="text-lg font-bold text-textDark mb-3">🎨 색상 선택</h3>
          <div className="grid grid-cols-7 gap-3">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  soundManager.playCardFlip();
                }}
                className={`w-12 h-12 rounded-full transition-all ${
                  selectedColor === color
                    ? 'ring-4 ring-primary scale-125 shadow-lg'
                    : 'hover:scale-110 active:scale-95'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`색상 ${color}`}
              />
            ))}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={handleReset} fullWidth>
            🔄 처음부터
          </Button>
          <Button variant="primary" onClick={handleSave} fullWidth>
            💾 저장하기
          </Button>
        </div>

        <Button
          variant="secondary"
          onClick={() => setSelectedTemplate(null)}
          fullWidth
        >
          ← 다른 그림 선택
        </Button>
      </div>
    </div>
  );
};
