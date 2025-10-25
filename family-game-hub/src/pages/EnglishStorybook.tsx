import { useState, useEffect } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { speechManager } from '../utils/speech';
import { getBooksByLevel, type Storybook } from '../data/storybooks';
import { useLearningStore } from '../store/learningStore';
import { useVoiceSettingsStore } from '../store/voiceSettingsStore';

interface EnglishStorybookProps {
  onBack: () => void;
}

export const EnglishStorybook = ({ onBack }: EnglishStorybookProps) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<Storybook | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);

  const { booksRead, updateBookProgress, markBookCompleted, getBookProgress } = useLearningStore();
  const { autoPlay } = useVoiceSettingsStore();

  // 자동 재생
  useEffect(() => {
    if (autoPlay && selectedBook && !showTranslation) {
      const page = selectedBook.pages[currentPage];
      setTimeout(() => {
        speechManager.speak(page.text);
      }, 300);
    }
  }, [currentPage, selectedBook, autoPlay, showTranslation]);

  const handleNextPage = () => {
    if (!selectedBook) return;

    if (currentPage < selectedBook.pages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      updateBookProgress(selectedBook.id, nextPage);
      setShowTranslation(false);
    } else {
      // 책 완료
      markBookCompleted(selectedBook.id);
      setSelectedBook(null);
      setSelectedLevel(null);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      if (selectedBook) {
        updateBookProgress(selectedBook.id, prevPage);
      }
      setShowTranslation(false);
    }
  };

  const handleSelectBook = (book: Storybook) => {
    setSelectedBook(book);
    const progress = getBookProgress(book.id);
    setCurrentPage(progress.currentPage || 0);
    setShowTranslation(false);
  };

  const handleSpeak = () => {
    if (!selectedBook) return;
    const page = selectedBook.pages[currentPage];
    if (showTranslation) {
      speechManager.speak(page.korean, 'ko-KR');
    } else {
      speechManager.speak(page.text);
    }
  };

  // 레벨 선택 화면
  if (selectedLevel === null) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="📖 책 읽기 - 레벨 선택" showBack onBack={onBack} />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">📚</div>
            <h2 className="text-2xl font-bold text-textDark">레벨을 선택하세요</h2>
            <p className="text-gray-600">실력에 맞는 책을 골라요!</p>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((level) => {
              const books = getBooksByLevel(level);
              const readCount = books.filter(
                (book) => booksRead[book.id]?.completed
              ).length;

              return (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-xl font-bold text-textDark mb-2">
                        {level === 1 && '🌟 레벨 1 - 쉬움'}
                        {level === 2 && '⭐ 레벨 2 - 보통'}
                        {level === 3 && '✨ 레벨 3 - 어려움'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {books.length}권의 책 | 읽은 책: {readCount}권
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${books.length > 0 ? (readCount / books.length) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-4xl">→</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 책 선택 화면
  if (!selectedBook) {
    const books = getBooksByLevel(selectedLevel);

    return (
      <div className="min-h-screen bg-background">
        <Header
          title={`📖 레벨 ${selectedLevel} - 책 선택`}
          showBack
          onBack={() => setSelectedLevel(null)}
        />

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">📚</div>
            <h2 className="text-2xl font-bold text-textDark">읽고 싶은 책을 골라요</h2>
          </div>

          <div className="space-y-4">
            {books.map((book) => {
              const progress = getBookProgress(book.id);
              const isCompleted = progress.completed;

              return (
                <button
                  key={book.id}
                  onClick={() => handleSelectBook(book)}
                  className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">{book.coverEmoji}</div>
                    <div className="flex-1 text-left">
                      <div className="text-lg font-bold text-textDark mb-1">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {book.titleKorean}
                      </div>
                      <div className="text-xs text-gray-500">
                        {book.pages.length}페이지
                        {isCompleted && (
                          <>
                            {' '}
                            | ✓ 읽음 ({progress.totalReads}번)
                          </>
                        )}
                        {progress.currentPage > 0 && !isCompleted && (
                          <> | 📖 진행 중 ({progress.currentPage + 1}페이지)</>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl">{isCompleted ? '✓' : '→'}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 책 읽기 화면
  const currentPageData = selectedBook.pages[currentPage];
  const isLastPage = currentPage === selectedBook.pages.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pb-20">
      <Header
        title={`📖 ${selectedBook.title}`}
        showBack
        onBack={() => {
          setSelectedBook(null);
          setCurrentPage(0);
        }}
      />

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 진행 표시 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-textDark">
              {currentPage + 1} / {selectedBook.pages.length}
            </span>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                showTranslation
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {showTranslation ? '🇰🇷 한글' : '🇺🇸 영어'}
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all"
              style={{ width: `${((currentPage + 1) / selectedBook.pages.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 책 페이지 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg min-h-[500px] flex flex-col justify-between">
          {/* 이미지 */}
          <div className="text-center">
            <div className="text-9xl mb-8">{currentPageData.image}</div>
          </div>

          {/* 텍스트 */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {!showTranslation ? (
              // 영어 텍스트
              <div>
                <p className="text-2xl font-bold text-textDark leading-relaxed text-center">
                  {currentPageData.text}
                </p>
              </div>
            ) : (
              // 한글 번역
              <div className="space-y-4">
                <p className="text-xl text-gray-600 text-center">
                  {currentPageData.korean}
                </p>
                <div className="border-t-2 border-gray-200 pt-4">
                  <p className="text-lg text-gray-500 text-center italic">
                    {currentPageData.text}
                  </p>
                </div>
              </div>
            )}

            {/* 음성 버튼 */}
            <div className="flex justify-center">
              <button
                onClick={handleSpeak}
                className="bg-blue-500 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-600 active:scale-95 transition-all"
              >
                🔊 {showTranslation ? '한글로 듣기' : '영어로 듣기'}
              </button>
            </div>
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            fullWidth
          >
            ← 이전 페이지
          </Button>
          <Button variant="primary" onClick={handleNextPage} fullWidth>
            {isLastPage ? '✓ 완료' : '다음 페이지 →'}
          </Button>
        </div>

        {isLastPage && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
            <p className="text-yellow-800 font-bold">
              🎉 마지막 페이지예요! "완료"를 눌러 책을 마무리하세요!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
