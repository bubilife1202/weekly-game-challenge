import { useState, useRef, useEffect } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';

// 색칠하기 템플릿 (SVG paths)
const coloringTemplates = [
  {
    id: 'flower',
    name: '꽃',
    emoji: '🌸',
    paths: [
      { id: 'petal1', d: 'M 250 150 Q 200 100, 250 50 Q 300 100, 250 150 Z', defaultColor: '#FFE4E1' },
      { id: 'petal2', d: 'M 250 150 Q 300 100, 350 150 Q 300 200, 250 150 Z', defaultColor: '#FFE4E1' },
      { id: 'petal3', d: 'M 250 150 Q 300 200, 250 250 Q 200 200, 250 150 Z', defaultColor: '#FFE4E1' },
      { id: 'petal4', d: 'M 250 150 Q 200 200, 150 150 Q 200 100, 250 150 Z', defaultColor: '#FFE4E1' },
      { id: 'center', d: 'M 250 150 m -30, 0 a 30,30 0 1,0 60,0 a 30,30 0 1,0 -60,0', defaultColor: '#FFD700' },
      { id: 'stem', d: 'M 245 250 L 245 400 L 255 400 L 255 250 Z', defaultColor: '#90EE90' },
      { id: 'leaf1', d: 'M 245 320 Q 200 320, 200 350 Q 220 340, 245 340 Z', defaultColor: '#90EE90' },
      { id: 'leaf2', d: 'M 255 360 Q 300 360, 300 390 Q 280 380, 255 380 Z', defaultColor: '#90EE90' },
    ],
  },
  {
    id: 'house',
    name: '집',
    emoji: '🏠',
    paths: [
      { id: 'roof', d: 'M 150 200 L 250 100 L 350 200 Z', defaultColor: '#FF6B6B' },
      { id: 'wall', d: 'M 170 200 L 170 350 L 330 350 L 330 200 Z', defaultColor: '#FFE66D' },
      { id: 'door', d: 'M 220 280 L 220 350 L 280 350 L 280 280 Z', defaultColor: '#8B4513' },
      { id: 'window1', d: 'M 185 230 L 185 270 L 215 270 L 215 230 Z', defaultColor: '#87CEEB' },
      { id: 'window2', d: 'M 285 230 L 285 270 L 315 270 L 315 230 Z', defaultColor: '#87CEEB' },
      { id: 'chimney', d: 'M 290 140 L 290 180 L 320 180 L 320 160 Z', defaultColor: '#8B4513' },
    ],
  },
  {
    id: 'car',
    name: '자동차',
    emoji: '🚗',
    paths: [
      { id: 'body', d: 'M 150 250 L 150 280 Q 150 290, 160 290 L 340 290 Q 350 290, 350 280 L 350 250 L 320 250 L 320 220 L 280 220 L 260 200 L 220 200 L 200 220 L 180 220 L 180 250 Z', defaultColor: '#FF6B6B' },
      { id: 'window1', d: 'M 210 215 L 230 215 L 245 225 L 245 245 L 210 245 Z', defaultColor: '#87CEEB' },
      { id: 'window2', d: 'M 255 225 L 270 215 L 290 215 L 290 245 L 255 245 Z', defaultColor: '#87CEEB' },
      { id: 'wheel1', d: 'M 200 290 m -25, 0 a 25,25 0 1,0 50,0 a 25,25 0 1,0 -50,0', defaultColor: '#333333' },
      { id: 'wheel2', d: 'M 300 290 m -25, 0 a 25,25 0 1,0 50,0 a 25,25 0 1,0 -50,0', defaultColor: '#333333' },
    ],
  },
  {
    id: 'butterfly',
    name: '나비',
    emoji: '🦋',
    paths: [
      { id: 'wing1', d: 'M 250 200 Q 200 150, 180 180 Q 160 220, 200 240 Q 230 230, 250 200 Z', defaultColor: '#FFB6C1' },
      { id: 'wing2', d: 'M 250 200 Q 300 150, 320 180 Q 340 220, 300 240 Q 270 230, 250 200 Z', defaultColor: '#FFB6C1' },
      { id: 'wing3', d: 'M 250 220 Q 200 250, 180 280 Q 170 310, 210 320 Q 240 300, 250 220 Z', defaultColor: '#DDA0DD' },
      { id: 'wing4', d: 'M 250 220 Q 300 250, 320 280 Q 330 310, 290 320 Q 260 300, 250 220 Z', defaultColor: '#DDA0DD' },
      { id: 'body', d: 'M 245 180 L 245 330 L 255 330 L 255 180 Z', defaultColor: '#8B4513' },
      { id: 'antenna1', d: 'M 245 180 Q 235 160, 230 150', defaultColor: 'none', stroke: '#000', strokeWidth: '2' },
      { id: 'antenna2', d: 'M 255 180 Q 265 160, 270 150', defaultColor: 'none', stroke: '#000', strokeWidth: '2' },
    ],
  },
];

// 색상 팔레트
const colorPalette = [
  '#FF6B6B', '#FFE66D', '#4ECDC4', '#95E1D3',
  '#FF1744', '#FF9800', '#FFEB3B', '#8BC34A',
  '#4CAF50', '#00BCD4', '#2196F3', '#3F51B5',
  '#9C27B0', '#E91E63', '#F48FB1', '#CE93D8',
  '#90EE90', '#87CEEB', '#FFB6C1', '#DDA0DD',
  '#8B4513', '#A0522D', '#D2691E', '#F4A460',
  '#333333', '#666666', '#999999', '#FFFFFF',
];

export const ColoringGame = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorPalette[0]);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const canvasRef = useRef<SVGSVGElement>(null);

  // 템플릿 선택 시 기본 색상 설정
  useEffect(() => {
    if (selectedTemplate !== null) {
      const template = coloringTemplates[selectedTemplate];
      const defaultColors: Record<string, string> = {};
      template.paths.forEach((path) => {
        defaultColors[path.id] = path.defaultColor;
      });
      setColors(defaultColors);
    }
  }, [selectedTemplate]);

  const handlePathClick = (pathId: string) => {
    setColors((prev) => ({
      ...prev,
      [pathId]: selectedColor,
    }));
  };

  const handleReset = () => {
    if (selectedTemplate !== null) {
      const template = coloringTemplates[selectedTemplate];
      const defaultColors: Record<string, string> = {};
      template.paths.forEach((path) => {
        defaultColors[path.id] = path.defaultColor;
      });
      setColors(defaultColors);
    }
  };

  const handleSave = () => {
    if (!canvasRef.current) return;

    // SVG를 이미지로 변환하여 다운로드
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

    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 2000);
  };

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
            <p className="text-gray-600">마음껏 색칠해보세요!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {coloringTemplates.map((template, index) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(index)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
              >
                <div className="text-center space-y-2">
                  <div className="text-5xl">{template.emoji}</div>
                  <div className="text-lg font-bold text-textDark">
                    {template.name}
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header
        title={`🎨 ${template.name} 색칠하기`}
        showBack
      />

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 저장 완료 메시지 */}
        {showSaveMessage && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-success text-textDark px-6 py-3 rounded-full shadow-lg z-50 animate-bounce">
            ✓ 그림이 저장되었어요!
          </div>
        )}

        {/* SVG 캔버스 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <svg
            ref={canvasRef}
            viewBox="0 0 500 450"
            className="w-full h-auto"
            style={{ maxHeight: '400px' }}
          >
            {template.paths.map((path) => (
              <path
                key={path.id}
                d={path.d}
                fill={colors[path.id] || path.defaultColor}
                stroke={path.stroke || '#000'}
                strokeWidth={path.strokeWidth || '2'}
                onClick={() => handlePathClick(path.id)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            ))}
          </svg>
        </div>

        {/* 색상 팔레트 */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h3 className="text-lg font-bold text-textDark mb-3">색상 선택</h3>
          <div className="grid grid-cols-7 gap-2">
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
