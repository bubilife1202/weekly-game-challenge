import { useState, useEffect } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { speechManager } from '../utils/speech';
import { allSentences, type Sentence } from '../data/sentences';
import { useLearningStore } from '../store/learningStore';
import { useVoiceSettingsStore } from '../store/voiceSettingsStore';

interface EnglishFlashcardsProps {
  onBack: () => void;
}

const categories = [
  { id: 'greetings', name: '인사/감정', emoji: '😊' },
  { id: 'daily', name: '일상생활', emoji: '🏠' },
  { id: 'school', name: '학교', emoji: '🏫' },
  { id: 'family', name: '가족', emoji: '👨‍👩‍👧‍👦' },
  { id: 'hobby', name: '취미', emoji: '⚽' },
  { id: 'food', name: '음식', emoji: '🍕' },
  { id: 'weather', name: '날씨', emoji: '🌤️' },
  { id: 'time', name: '시간', emoji: '⏰' },
  { id: 'feelings', name: '감정', emoji: '😊' },
  { id: 'animals', name: '동물', emoji: '🐶' },
  { id: 'health', name: '건강', emoji: '💪' },
  { id: 'shopping', name: '쇼핑', emoji: '🛍️' },
  { id: 'travel', name: '여행', emoji: '✈️' },
  { id: 'numbers', name: '숫자', emoji: '🔢' },
];

export const EnglishFlashcards = ({ onBack }: EnglishFlashcardsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  const { sentencesLearned, markSentenceLearned, toggleBookmark, getCategoryProgress } =
    useLearningStore();
  const { autoPlay } = useVoiceSettingsStore();

  // 카테고리 선택 시 문장 로드
  useEffect(() => {
    if (selectedCategory) {
      let filtered = allSentences.filter((s) => s.category === selectedCategory);

      // 북마크만 보기
      if (showBookmarkedOnly) {
        filtered = filtered.filter((s) => sentencesLearned[s.sentence]?.bookmarked);
      }

      setSentences(filtered);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [selectedCategory, showBookmarkedOnly, sentencesLearned]);

  // 자동 재생
  useEffect(() => {
    if (autoPlay && !isFlipped && sentences.length > 0) {
      const sentence = sentences[currentIndex];
      setTimeout(() => {
        speechManager.speak(sentence.sentence);
      }, 300);
    }
  }, [currentIndex, isFlipped, sentences, autoPlay]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMarkLearned = () => {
    if (sentences.length > 0) {
      markSentenceLearned(sentences[currentIndex].sentence);
    }
  };

  const handleToggleBookmark = () => {
    if (sentences.length > 0) {
      toggleBookmark(sentences[currentIndex].sentence);
    }
  };

  const handleSpeak = () => {
    if (sentences.length > 0) {
      const sentence = sentences[currentIndex];
      if (isFlipped) {
        speechManager.speak(sentence.korean, 'ko-KR');
      } else {
        speechManager.speak(sentence.sentence);
      }
    }
  };

  // 카테고리 선택 화면
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="🎓 배우기 - 카테고리 선택" showBack onBack={onBack} />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">📂</div>
            <h2 className="text-2xl font-bold text-textDark">카테고리를 선택하세요</h2>
            <p className="text-gray-600">원하는 주제를 골라 학습해요!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => {
              const progress = getCategoryProgress(category.id);
              const isCompleted = progress.percentage === 100;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
                >
                  <div className="text-4xl mb-2">{category.emoji}</div>
                  <div className="font-bold text-textDark mb-1">{category.name}</div>
                  <div className="text-sm text-gray-600 mb-2">
                    {progress.total}개 문장
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isCompleted ? 'bg-success' : 'bg-primary'
                      }`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {progress.percentage}% {isCompleted && '✓'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 플래시카드 화면
  if (sentences.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          title="🎓 플래시카드 학습"
          showBack
          onBack={() => setSelectedCategory(null)}
        />
        <div className="max-w-2xl mx-auto p-4 text-center py-20">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-gray-600">북마크한 문장이 없어요!</p>
          <Button
            variant="primary"
            onClick={() => setShowBookmarkedOnly(false)}
            className="mt-4"
          >
            전체 문장 보기
          </Button>
        </div>
      </div>
    );
  }

  const currentSentence = sentences[currentIndex];
  const isLearned = sentencesLearned[currentSentence.sentence]?.learned || false;
  const isBookmarked = sentencesLearned[currentSentence.sentence]?.bookmarked || false;
  const categoryInfo = categories.find((c) => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header
        title={`🎓 ${categoryInfo?.emoji} ${categoryInfo?.name}`}
        showBack
        onBack={() => setSelectedCategory(null)}
      />

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 진행 표시 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-textDark">
              {currentIndex + 1} / {sentences.length}
            </span>
            <button
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
              className={`text-sm px-3 py-1 rounded-lg font-bold ${
                showBookmarkedOnly
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {showBookmarkedOnly ? '⭐ 북마크만' : '📝 전체'}
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 플래시카드 */}
        <div
          className="relative bg-white rounded-2xl p-8 shadow-lg min-h-[400px] flex flex-col justify-center items-center cursor-pointer"
          onClick={handleFlip}
        >
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSpeak();
              }}
              className="bg-secondary/20 text-secondary p-3 rounded-full hover:bg-secondary/30 active:scale-95 transition-all"
            >
              🔊
            </button>
          </div>

          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">{currentSentence.emoji}</div>

            {!isFlipped ? (
              // 앞면: 영어
              <>
                <div className="text-2xl font-bold text-textDark mb-4">
                  {currentSentence.sentence}
                </div>
                <div className="text-gray-500 text-sm">탭하여 뒤집기 →</div>
              </>
            ) : (
              // 뒷면: 한글
              <>
                <div className="text-2xl font-bold text-primary mb-2">
                  {currentSentence.korean}
                </div>
                <div className="text-lg text-gray-600 mt-4">
                  {currentSentence.sentence}
                </div>
                <div className="text-gray-500 text-sm mt-4">← 탭하여 다시 뒤집기</div>
              </>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleMarkLearned}
            className={`rounded-xl p-4 font-bold transition-all active:scale-95 ${
              isLearned
                ? 'bg-success text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
          >
            {isLearned ? '✓ 학습 완료' : '✓ 알았어요'}
          </button>

          <button
            onClick={handleToggleBookmark}
            className={`rounded-xl p-4 font-bold transition-all active:scale-95 ${
              isBookmarked
                ? 'bg-yellow-400 text-white'
                : 'bg-white text-gray-700 border-2 border-gray-200'
            }`}
          >
            {isBookmarked ? '⭐ 북마크됨' : '☆ 북마크'}
          </button>
        </div>

        {/* 네비게이션 */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            fullWidth
          >
            ← 이전
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={currentIndex === sentences.length - 1}
            fullWidth
          >
            다음 →
          </Button>
        </div>
      </div>
    </div>
  );
};
