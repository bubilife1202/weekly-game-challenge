import { useState, useRef, useEffect } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';

// 복잡한 색칠하기 템플릿 (난이도별)
const coloringTemplates = [
  {
    id: 'mandala-hard',
    name: '만다라',
    emoji: '🌀',
    difficulty: '어려움',
    areas: 80,
    paths: [
      // 중앙 원
      ...Array.from({ length: 12 }, (_, i) => ({
        id: `center-${i}`,
        d: `M 250 250 L ${250 + 30 * Math.cos((i * 30 * Math.PI) / 180)} ${250 + 30 * Math.sin((i * 30 * Math.PI) / 180)} L ${250 + 30 * Math.cos(((i + 1) * 30 * Math.PI) / 180)} ${250 + 30 * Math.sin(((i + 1) * 30 * Math.PI) / 180)} Z`,
        defaultColor: i % 2 === 0 ? '#FFE4E1' : '#FFB6C1',
      })),
      // 중간 원
      ...Array.from({ length: 16 }, (_, i) => ({
        id: `middle-${i}`,
        d: `M 250 250 L ${250 + 60 * Math.cos((i * 22.5 * Math.PI) / 180)} ${250 + 60 * Math.sin((i * 22.5 * Math.PI) / 180)} L ${250 + 60 * Math.cos(((i + 1) * 22.5 * Math.PI) / 180)} ${250 + 60 * Math.sin(((i + 1) * 22.5 * Math.PI) / 180)} L ${250 + 40 * Math.cos(((i + 1) * 22.5 * Math.PI) / 180)} ${250 + 40 * Math.sin(((i + 1) * 22.5 * Math.PI) / 180)} L ${250 + 40 * Math.cos((i * 22.5 * Math.PI) / 180)} ${250 + 40 * Math.sin((i * 22.5 * Math.PI) / 180)} Z`,
        defaultColor: i % 3 === 0 ? '#DDA0DD' : i % 3 === 1 ? '#87CEEB' : '#90EE90',
      })),
      // 외곽 원
      ...Array.from({ length: 24 }, (_, i) => ({
        id: `outer-${i}`,
        d: `M 250 250 L ${250 + 90 * Math.cos((i * 15 * Math.PI) / 180)} ${250 + 90 * Math.sin((i * 15 * Math.PI) / 180)} L ${250 + 90 * Math.cos(((i + 1) * 15 * Math.PI) / 180)} ${250 + 90 * Math.sin(((i + 1) * 15 * Math.PI) / 180)} L ${250 + 70 * Math.cos(((i + 1) * 15 * Math.PI) / 180)} ${250 + 70 * Math.sin(((i + 1) * 15 * Math.PI) / 180)} L ${250 + 70 * Math.cos((i * 15 * Math.PI) / 180)} ${250 + 70 * Math.sin((i * 15 * Math.PI) / 180)} Z`,
        defaultColor: i % 4 === 0 ? '#FF6B6B' : i % 4 === 1 ? '#FFE66D' : i % 4 === 2 ? '#4ECDC4' : '#95E1D3',
      })),
      // 가장 외곽 꽃잎
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `petal-${i}`,
        d: `M ${250 + 100 * Math.cos((i * 45 * Math.PI) / 180)} ${250 + 100 * Math.sin((i * 45 * Math.PI) / 180)} Q ${250 + 140 * Math.cos((i * 45 * Math.PI) / 180)} ${250 + 140 * Math.sin((i * 45 * Math.PI) / 180)} ${250 + 100 * Math.cos(((i + 1) * 45 * Math.PI) / 180)} ${250 + 100 * Math.sin(((i + 1) * 45 * Math.PI) / 180)} L ${250 + 90 * Math.cos(((i + 0.5) * 45 * Math.PI) / 180)} ${250 + 90 * Math.sin(((i + 0.5) * 45 * Math.PI) / 180)} Z`,
        defaultColor: '#F48FB1',
      })),
    ],
  },
  {
    id: 'dragon-extreme',
    name: '드래곤',
    emoji: '🐉',
    difficulty: '매우 어려움',
    areas: 120,
    paths: [
      // 머리
      { id: 'head-main', d: 'M 250 150 Q 280 120 320 140 Q 340 160 330 190 Q 310 210 280 200 Q 260 190 250 170 Z', defaultColor: '#FF6B6B' },
      { id: 'head-top', d: 'M 270 130 Q 290 120 310 130 Q 300 145 280 140 Z', defaultColor: '#FF1744' },
      // 눈
      { id: 'eye-left', d: 'M 270 160 m -8, 0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0', defaultColor: '#FFD700' },
      { id: 'eye-right', d: 'M 300 160 m -8, 0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0', defaultColor: '#FFD700' },
      { id: 'pupil-left', d: 'M 270 160 m -4, 0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0', defaultColor: '#000000' },
      { id: 'pupil-right', d: 'M 300 160 m -4, 0 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0', defaultColor: '#000000' },
      // 코
      { id: 'nose-1', d: 'M 330 170 L 360 175 L 355 185 Z', defaultColor: '#8B4513' },
      { id: 'nose-2', d: 'M 330 180 L 360 185 L 355 195 Z', defaultColor: '#8B4513' },
      // 뿔 (좌우 각 5개씩)
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `horn-left-${i}`,
        d: `M ${265 - i * 8} ${145 - i * 12} L ${260 - i * 8} ${130 - i * 12} L ${270 - i * 8} ${135 - i * 12} Z`,
        defaultColor: i % 2 === 0 ? '#FFE66D' : '#FFD700',
      })),
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `horn-right-${i}`,
        d: `M ${305 + i * 8} ${145 - i * 12} L ${310 + i * 8} ${130 - i * 12} L ${300 + i * 8} ${135 - i * 12} Z`,
        defaultColor: i % 2 === 0 ? '#FFE66D' : '#FFD700',
      })),
      // 몸통 (10개 세그먼트)
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `body-${i}`,
        d: `M ${250 + i * 15} ${200 + Math.sin(i * 0.5) * 20} Q ${255 + i * 15} ${220 + Math.sin(i * 0.5) * 20} ${265 + i * 15} ${210 + Math.sin(i * 0.5 + 0.2) * 20} L ${265 + (i + 1) * 15} ${210 + Math.sin((i + 1) * 0.5 + 0.2) * 20} Q ${255 + (i + 1) * 15} ${220 + Math.sin((i + 1) * 0.5) * 20} ${250 + (i + 1) * 15} ${200 + Math.sin((i + 1) * 0.5) * 20} Z`,
        defaultColor: i % 3 === 0 ? '#FF6B6B' : i % 3 === 1 ? '#FF1744' : '#FF9800',
      })),
      // 비늘 (각 세그먼트에 3개씩)
      ...Array.from({ length: 30 }, (_, i) => ({
        id: `scale-${i}`,
        d: `M ${255 + Math.floor(i / 3) * 15 + (i % 3) * 4} ${205 + Math.sin(Math.floor(i / 3) * 0.5) * 20} L ${257 + Math.floor(i / 3) * 15 + (i % 3) * 4} ${210 + Math.sin(Math.floor(i / 3) * 0.5) * 20} L ${253 + Math.floor(i / 3) * 15 + (i % 3) * 4} ${215 + Math.sin(Math.floor(i / 3) * 0.5) * 20} Z`,
        defaultColor: i % 2 === 0 ? '#FFD700' : '#FFE66D',
      })),
      // 배
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `belly-${i}`,
        d: `M ${250 + i * 15} ${220 + Math.sin(i * 0.5) * 20} L ${265 + i * 15} ${220 + Math.sin(i * 0.5 + 0.2) * 20} L ${265 + (i + 1) * 15} ${220 + Math.sin((i + 1) * 0.5 + 0.2) * 20} L ${250 + (i + 1) * 15} ${220 + Math.sin((i + 1) * 0.5) * 20} Z`,
        defaultColor: '#FFE4E1',
      })),
      // 날개 (좌우)
      { id: 'wing-left-1', d: 'M 280 190 Q 220 180 200 200 Q 210 220 240 210 Z', defaultColor: '#4ECDC4' },
      { id: 'wing-left-2', d: 'M 240 210 Q 200 220 190 250 Q 210 260 235 240 Z', defaultColor: '#95E1D3' },
      { id: 'wing-right-1', d: 'M 320 210 Q 380 200 400 220 Q 390 240 360 230 Z', defaultColor: '#4ECDC4' },
      { id: 'wing-right-2', d: 'M 360 230 Q 400 240 410 270 Q 390 280 365 260 Z', defaultColor: '#95E1D3' },
      // 꼬리 (20개 세그먼트)
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `tail-${i}`,
        d: `M ${400 + i * 8} ${230 + Math.sin(i * 0.3) * 15} L ${405 + i * 8} ${235 + Math.sin(i * 0.3) * 15} L ${405 + (i + 1) * 8} ${235 + Math.sin((i + 1) * 0.3) * 15} L ${400 + (i + 1) * 8} ${230 + Math.sin((i + 1) * 0.3) * 15} Z`,
        defaultColor: i % 4 === 0 ? '#FF6B6B' : i % 4 === 1 ? '#FF1744' : i % 4 === 2 ? '#FF9800' : '#FFD700',
      })),
    ],
  },
  {
    id: 'castle-hard',
    name: '성',
    emoji: '🏰',
    difficulty: '어려움',
    areas: 95,
    paths: [
      // 기본 성벽 (5개 층)
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `wall-${i}`,
        d: `M ${150 - i * 10} ${350 - i * 40} L ${150 - i * 10} ${390 - i * 40} L ${350 + i * 10} ${390 - i * 40} L ${350 + i * 10} ${350 - i * 40} Z`,
        defaultColor: i % 2 === 0 ? '#D2691E' : '#A0522D',
      })),
      // 창문 (각 층에 5개씩 = 25개)
      ...Array.from({ length: 25 }, (_, i) => ({
        id: `window-${i}`,
        d: `M ${170 + (i % 5) * 35 - Math.floor(i / 5) * 10} ${360 - Math.floor(i / 5) * 40} L ${170 + (i % 5) * 35 - Math.floor(i / 5) * 10} ${380 - Math.floor(i / 5) * 40} L ${190 + (i % 5) * 35 - Math.floor(i / 5) * 10} ${380 - Math.floor(i / 5) * 40} L ${190 + (i % 5) * 35 - Math.floor(i / 5) * 10} ${360 - Math.floor(i / 5) * 40} Z`,
        defaultColor: i % 3 === 0 ? '#FFD700' : '#87CEEB',
      })),
      // 탑 (좌우 2개)
      { id: 'tower-left', d: 'M 120 200 L 120 390 L 180 390 L 180 200 Z', defaultColor: '#8B4513' },
      { id: 'tower-right', d: 'M 320 200 L 320 390 L 380 390 L 380 200 Z', defaultColor: '#8B4513' },
      // 탑 지붕
      { id: 'roof-left', d: 'M 110 200 L 150 150 L 190 200 Z', defaultColor: '#FF6B6B' },
      { id: 'roof-right', d: 'M 310 200 L 350 150 L 390 200 Z', defaultColor: '#FF6B6B' },
      // 탑 창문 (각 탑에 8개씩)
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `tower-window-left-${i}`,
        d: `M 135 ${220 + i * 20} L 135 ${235 + i * 20} L 165 ${235 + i * 20} L 165 ${220 + i * 20} Z`,
        defaultColor: i % 2 === 0 ? '#FFD700' : '#87CEEB',
      })),
      ...Array.from({ length: 8 }, (_, i) => ({
        id: `tower-window-right-${i}`,
        d: `M 335 ${220 + i * 20} L 335 ${235 + i * 20} L 365 ${235 + i * 20} L 365 ${220 + i * 20} Z`,
        defaultColor: i % 2 === 0 ? '#FFD700' : '#87CEEB',
      })),
      // 정문
      { id: 'gate', d: 'M 220 320 Q 220 280 250 280 Q 280 280 280 320 L 280 390 L 220 390 Z', defaultColor: '#654321' },
      { id: 'gate-detail-1', d: 'M 235 300 L 235 380 L 240 380 L 240 300 Z', defaultColor: '#8B4513' },
      { id: 'gate-detail-2', d: 'M 260 300 L 260 380 L 265 380 L 265 300 Z', defaultColor: '#8B4513' },
      // 깃발 (좌우 탑 위)
      { id: 'flag-left', d: 'M 150 140 L 150 155 L 175 147.5 Z', defaultColor: '#FF1744' },
      { id: 'flag-right', d: 'M 350 140 L 350 155 L 325 147.5 Z', defaultColor: '#FF1744' },
      // 성벽 톱니 (20개)
      ...Array.from({ length: 20 }, (_, i) => ({
        id: `battlement-${i}`,
        d: `M ${155 + i * 10} ${150} L ${155 + i * 10} ${165} L ${165 + i * 10} ${165} L ${165 + i * 10} ${150} Z`,
        defaultColor: i % 2 === 0 ? '#D2691E' : '#A0522D',
      })),
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

// 색상 팔레트 (확장)
const colorPalette = [
  '#FF6B6B', '#FFE66D', '#4ECDC4', '#95E1D3',
  '#FF1744', '#FF9800', '#FFEB3B', '#8BC34A',
  '#4CAF50', '#00BCD4', '#2196F3', '#3F51B5',
  '#9C27B0', '#E91E63', '#F48FB1', '#CE93D8',
  '#90EE90', '#87CEEB', '#FFB6C1', '#DDA0DD',
  '#8B4513', '#A0522D', '#D2691E', '#F4A460',
  '#333333', '#666666', '#999999', '#FFFFFF',
  '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#800000', '#008000',
];

export const ColoringGame = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorPalette[0]);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const canvasRef = useRef<SVGSVGElement>(null);

  // 카메라 관련 state
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement>(null);
  const coloringCanvasRef = useRef<HTMLCanvasElement>(null);

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
    }
  }, [selectedTemplate]);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('카메라 접근 실패:', err);
      alert('카메라에 접근할 수 없습니다. 권한을 확인해주세요.');
      setSelectedTemplate(null);
    }
  };

  // 사진 촬영
  const capturePhoto = () => {
    if (videoRef.current && photoCanvasRef.current) {
      const video = videoRef.current;
      const canvas = photoCanvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL('image/png');
        setCapturedImage(imageData);

        // 카메라 스트림 종료
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());

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
      }
    }
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

    // 색상을 RGB로 변환
    const rgb = hexToRgb(fillColor);
    if (!rgb) return;

    // 같은 색이면 리턴
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

      // 색상이 다르면 스킵
      if (Math.abs(r - startR) > 30 || Math.abs(g - startG) > 30 || Math.abs(b - startB) > 30) continue;

      visited.add(key);

      // 색상 변경
      pixels[pos] = rgb.r;
      pixels[pos + 1] = rgb.g;
      pixels[pos + 2] = rgb.b;

      // 인접 픽셀 추가
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
    setColors((prev) => ({
      ...prev,
      [pathId]: selectedColor,
    }));
  };

  const handleReset = () => {
    if (capturedImage && coloringCanvasRef.current) {
      // 사진 모드: 원본 이미지로 리셋
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
      // SVG 모드: 기본 색상으로 리셋
      const template = coloringTemplates[selectedTemplate];
      const defaultColors: Record<string, string> = {};
      template.paths.forEach((path) => {
        defaultColors[path.id] = path.defaultColor;
      });
      setColors(defaultColors);
    }
  };

  const handleSave = () => {
    if (capturedImage && coloringCanvasRef.current) {
      // 캔버스 저장
      const link = document.createElement('a');
      link.download = `coloring-photo-${Date.now()}.png`;
      link.href = coloringCanvasRef.current.toDataURL();
      link.click();
    } else if (canvasRef.current) {
      // SVG 저장
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
            <p className="text-gray-600">난이도가 높을수록 더 재미있어요!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {coloringTemplates.map((template, index) => (
              <button
                key={template.id}
                onClick={() => {
                  if (template.id === 'camera') {
                    setSelectedTemplate(index);
                    startCamera();
                  } else {
                    setSelectedTemplate(index);
                  }
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

  // 카메라 모드
  if (template.id === 'camera' && !capturedImage) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="📸 사진 촬영" showBack />
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <div className="text-center space-y-4 mb-4">
            <p className="text-gray-600">사진을 찍으면 색칠할 수 있어요!</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              autoPlay
              playsInline
            />
            <canvas ref={photoCanvasRef} className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                if (videoRef.current) {
                  const stream = videoRef.current.srcObject as MediaStream;
                  stream?.getTracks().forEach(track => track.stop());
                }
                setSelectedTemplate(null);
              }}
              fullWidth
            >
              ← 취소
            </Button>
            <Button variant="primary" onClick={capturePhoto} fullWidth>
              📸 촬영
            </Button>
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
              style={{ maxHeight: '400px', imageRendering: 'pixelated' }}
            />
          </div>

          {/* 색상 팔레트 */}
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-bold text-textDark mb-3">색상 선택</h3>
            <div className="grid grid-cols-8 gap-2">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
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
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header
        title={`🎨 ${template.name} 색칠하기`}
        showBack
      />

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {showSaveMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-success text-textDark px-6 py-3 rounded-full shadow-lg z-50 animate-bounce">
            ✓ 그림이 저장되었어요!
          </div>
        )}

        {/* 난이도 표시 */}
        <div className="bg-white rounded-xl p-3 shadow-md text-center">
          <span className="text-lg font-bold text-primary">
            {template.difficulty} - {template.areas}개 영역
          </span>
        </div>

        {/* SVG 캔버스 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg overflow-auto">
          <svg
            ref={canvasRef}
            viewBox="0 0 600 500"
            className="w-full h-auto"
            style={{ maxHeight: '500px' }}
          >
            {template.paths.map((path) => (
              <path
                key={path.id}
                d={path.d}
                fill={colors[path.id] || path.defaultColor}
                stroke={'#000'}
                strokeWidth={'1'}
                onClick={() => handlePathClick(path.id)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </svg>
        </div>

        {/* 색상 팔레트 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="text-lg font-bold text-textDark mb-3">색상 선택</h3>
          <div className="grid grid-cols-8 gap-2">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
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
