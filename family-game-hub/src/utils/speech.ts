// Web Speech API를 사용한 음성 읽기 유틸리티

class SpeechManager {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  speak(text: string, lang: string = 'en-US', rate: number = 0.85) {
    // 이전 음성 중지
    this.stop();

    // 새 음성 생성
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = lang;
    this.utterance.rate = rate; // 읽기 속도 (0.85 = 아이들이 듣기 좋은 속도)
    this.utterance.pitch = 1.1; // 음높이 (약간 높게 - 더 친근하게)
    this.utterance.volume = 1; // 볼륨

    // 언어에 맞는 최적의 음성 찾기
    const voices = this.synthesis.getVoices();

    if (lang.startsWith('ko')) {
      // 한국어 음성 찾기
      const koreanVoice = voices.find(
        (voice) =>
          voice.lang.includes('ko-') &&
          (voice.name.includes('Google') ||
           voice.name.includes('Yuna') ||
           voice.name.includes('Microsoft'))
      ) || voices.find(voice => voice.lang.includes('ko-'));

      if (koreanVoice) {
        this.utterance.voice = koreanVoice;
        this.utterance.rate = 0.9; // 한국어는 조금 더 빠르게
      }
    } else {
      // 영어 음성 찾기 (여성 음성 우선)
      const englishVoice = voices.find(
        (voice) =>
          voice.lang.includes('en-') &&
          (voice.name.includes('Google') ||
           voice.name.includes('Microsoft') ||
           voice.name.includes('Samantha') ||
           voice.name.includes('Karen'))
      ) || voices.find(voice => voice.lang.includes('en-'));

      if (englishVoice) {
        this.utterance.voice = englishVoice;
      }
    }

    this.synthesis.speak(this.utterance);
  }

  stop() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  }

  // 음성이 준비될 때까지 대기
  async waitForVoices(): Promise<void> {
    return new Promise((resolve) => {
      const voices = this.synthesis.getVoices();
      if (voices.length > 0) {
        resolve();
        return;
      }

      // voiceschanged 이벤트 대기
      this.synthesis.addEventListener('voiceschanged', () => {
        resolve();
      }, { once: true });
    });
  }
}

export const speechManager = new SpeechManager();
