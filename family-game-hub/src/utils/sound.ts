// 간단한 사운드 생성 (Web Audio API 사용)
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled = true;
  private volume = 0.7;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // 카드 선택 소리
  playCardFlip() {
    this.playTone(800, 0.1, 'sine');
  }

  // 짝 맞춤 소리
  playMatch() {
    if (!this.audioContext) return;
    this.playTone(523, 0.1, 'sine'); // C
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 100); // E
    setTimeout(() => this.playTone(784, 0.2, 'sine'), 200); // G
  }

  // 틀림 소리
  playMismatch() {
    this.playTone(200, 0.2, 'sawtooth');
  }

  // 게임 완료 소리
  playComplete() {
    if (!this.audioContext) return;
    const notes = [523, 659, 784, 1047]; // C E G C
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.15, 'sine'), i * 100);
    });
  }

  // 버튼 클릭 소리
  playClick() {
    this.playTone(600, 0.05, 'square');
  }
}

export const soundManager = new SoundManager();
