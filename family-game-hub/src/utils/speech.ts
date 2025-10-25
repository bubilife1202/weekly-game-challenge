// Web Speech API를 사용한 음성 읽기 유틸리티

class SpeechManager {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  speak(text: string, lang: string = 'en-US', rate: number = 0.9) {
    // 이전 음성 중지
    this.stop();

    // 새 음성 생성
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = lang;
    this.utterance.rate = rate; // 읽기 속도 (0.9 = 약간 느리게)
    this.utterance.pitch = 1; // 음높이
    this.utterance.volume = 1; // 볼륨

    // 영어 음성 찾기
    const voices = this.synthesis.getVoices();
    const englishVoice = voices.find(
      (voice) =>
        voice.lang.includes('en-') &&
        (voice.name.includes('Google') || voice.name.includes('Microsoft'))
    );
    if (englishVoice) {
      this.utterance.voice = englishVoice;
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
