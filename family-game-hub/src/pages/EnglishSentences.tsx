import { useState } from 'react';
import { Header } from '../components/common/Header';
import { EnglishQuiz } from './EnglishQuiz';
import { EnglishFlashcards } from './EnglishFlashcards';
import { EnglishStorybook } from './EnglishStorybook';
import { useLearningStore } from '../store/learningStore';
import { useVoiceSettingsStore } from '../store/voiceSettingsStore';

type MainMode = null | 'storybook' | 'flashcards' | 'quiz';

export const EnglishSentences = () => {
  const [selectedMode, setSelectedMode] = useState<MainMode>(null);
  const { getTotalLearnedSentences, getTotalBooksRead } = useLearningStore();
  const { autoPlay, toggleAutoPlay } = useVoiceSettingsStore();

  // 모드별 컴포넌트 렌더링
  if (selectedMode === 'quiz') {
    return <EnglishQuiz />;
  }

  if (selectedMode === 'flashcards') {
    return <EnglishFlashcards onBack={() => setSelectedMode(null)} />;
  }

  if (selectedMode === 'storybook') {
    return <EnglishStorybook onBack={() => setSelectedMode(null)} />;
  }

  // 메인 모드 선택 화면
  return (
    <div className="min-h-screen bg-background">
      <Header title="📖 영어 문장 만들기" showBack />

      <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
        {/* 헤더 */}
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">📚</div>
          <h2 className="text-2xl font-bold text-textDark">
            영어 학습 모드를 선택하세요
          </h2>
          <p className="text-gray-600">책 읽기, 배우기, 퀴즈 중 선택해요!</p>
        </div>

        {/* 음성 설정 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔊</span>
              <div>
                <div className="font-bold text-textDark">음성 자동재생</div>
                <div className="text-xs text-gray-600">
                  {autoPlay ? '자동으로 읽어줘요' : '버튼을 눌러야 읽어줘요'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleAutoPlay}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                autoPlay ? 'bg-success' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  autoPlay ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* 학습 통계 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-primary">{getTotalLearnedSentences()}</div>
            <div className="text-sm text-gray-600">배운 문장</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-secondary">{getTotalBooksRead()}</div>
            <div className="text-sm text-gray-600">읽은 책</div>
          </div>
        </div>

        {/* 모드 선택 버튼 */}
        <div className="space-y-4">
          {/* 책 읽기 모드 */}
          <button
            onClick={() => setSelectedMode('storybook')}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-3xl">📖</span>
                  책 읽기 모드
                </div>
                <div className="text-sm opacity-90">
                  • 레벨별 영어 동화책
                  <br />
                  • 페이지 넘기며 읽기
                  <br />
                  • 음성으로 듣기
                  <br />• 단어 클릭하면 뜻 보기
                </div>
              </div>
              <div className="text-4xl">→</div>
            </div>
          </button>

          {/* 배우기 모드 */}
          <button
            onClick={() => setSelectedMode('flashcards')}
            className="w-full bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-3xl">🎓</span>
                  배우기 모드
                </div>
                <div className="text-sm opacity-90">
                  • 플래시카드로 학습
                  <br />
                  • 카테고리별 학습
                  <br />
                  • 앞뒤 뒤집기
                  <br />• 북마크로 복습
                </div>
              </div>
              <div className="text-4xl">→</div>
            </div>
          </button>

          {/* 퀴즈 모드 */}
          <button
            onClick={() => setSelectedMode('quiz')}
            className="w-full bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-3xl">🎮</span>
                  퀴즈 모드
                </div>
                <div className="text-sm opacity-90">
                  • 순서 맞추기
                  <br />
                  • 빈칸 채우기
                  <br />
                  • 문장 선택하기
                  <br />• XP 획득 & 레벨업
                </div>
              </div>
              <div className="text-4xl">→</div>
            </div>
          </button>
        </div>

        {/* 안내 */}
        <div className="bg-primary/10 rounded-xl p-4 text-center">
          <p className="text-sm text-primary font-bold">
            💡 팁: 먼저 책 읽기와 배우기로 학습한 후, 퀴즈로 실력을 테스트하세요!
          </p>
        </div>
      </div>
    </div>
  );
};
