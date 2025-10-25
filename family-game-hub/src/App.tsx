import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { MemoryGame } from './pages/MemoryGame';
import { ColoringGame } from './pages/ColoringGame';
import { WorldMapQuiz } from './pages/WorldMapQuiz';
import { EnglishWords } from './pages/EnglishWords';
import { Profiles } from './pages/Profiles';
import { useEffect } from 'react';
import { useSettingsStore } from './store/settingsStore';
import { soundManager } from './utils/sound';

function App() {
  const { soundEnabled, volume } = useSettingsStore();

  // 사운드 설정 동기화
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
    soundManager.setVolume(volume);
  }, [soundEnabled, volume]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/memory" element={<MemoryGame />} />
        <Route path="/game/coloring" element={<ColoringGame />} />
        <Route path="/game/world-map" element={<WorldMapQuiz />} />
        <Route path="/game/english-words" element={<EnglishWords />} />
        <Route path="/profiles" element={<Profiles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
