import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { MemoryGame } from './pages/MemoryGame';
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
        <Route path="/profiles" element={<Profiles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
