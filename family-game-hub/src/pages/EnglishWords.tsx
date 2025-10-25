import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { soundManager } from '../utils/sound';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';

// 영어 단어 데이터 (학년별)
const wordsByGrade = {
  grade1: [
    { word: 'cat', korean: '고양이', emoji: '🐱', hint: '야옹야옹' },
    { word: 'dog', korean: '강아지', emoji: '🐶', hint: '멍멍' },
    { word: 'book', korean: '책', emoji: '📚', hint: '읽는 것' },
    { word: 'apple', korean: '사과', emoji: '🍎', hint: '빨간 과일' },
    { word: 'ball', korean: '공', emoji: '⚽', hint: '던지는 것' },
    { word: 'car', korean: '자동차', emoji: '🚗', hint: '부릉부릉' },
    { word: 'tree', korean: '나무', emoji: '🌳', hint: '푸르른' },
    { word: 'sun', korean: '태양', emoji: '☀️', hint: '뜨겁고 밝은' },
    { word: 'moon', korean: '달', emoji: '🌙', hint: '밤에 보이는' },
    { word: 'star', korean: '별', emoji: '⭐', hint: '반짝반짝' },
  ],
  grade2: [
    { word: 'family', korean: '가족', emoji: '👨‍👩‍👧‍👦', hint: '엄마 아빠' },
    { word: 'friend', korean: '친구', emoji: '👫', hint: '같이 노는' },
    { word: 'school', korean: '학교', emoji: '🏫', hint: '공부하는 곳' },
    { word: 'teacher', korean: '선생님', emoji: '👨‍🏫', hint: '가르치는 사람' },
    { word: 'house', korean: '집', emoji: '🏠', hint: '사는 곳' },
    { word: 'water', korean: '물', emoji: '💧', hint: '마시는 것' },
    { word: 'food', korean: '음식', emoji: '🍔', hint: '먹는 것' },
    { word: 'flower', korean: '꽃', emoji: '🌸', hint: '예쁜 식물' },
    { word: 'bird', korean: '새', emoji: '🐦', hint: '날아다니는' },
    { word: 'fish', korean: '물고기', emoji: '🐠', hint: '헤엄치는' },
  ],
  grade3: [
    { word: 'birthday', korean: '생일', emoji: '🎂', hint: '케이크 먹는 날' },
    { word: 'computer', korean: '컴퓨터', emoji: '💻', hint: '게임하는 것' },
    { word: 'airplane', korean: '비행기', emoji: '✈️', hint: '하늘을 나는' },
    { word: 'hospital', korean: '병원', emoji: '🏥', hint: '아플 때 가는 곳' },
    { word: 'restaurant', korean: '식당', emoji: '🍽️', hint: '밥 먹는 곳' },
    { word: 'bicycle', korean: '자전거', emoji: '🚲', hint: '페달을 밟는' },
    { word: 'umbrella', korean: '우산', emoji: '☂️', hint: '비 올 때' },
    { word: 'rainbow', korean: '무지개', emoji: '🌈', hint: '7가지 색' },
    { word: 'mountain', korean: '산', emoji: '⛰️', hint: '높은 곳' },
    { word: 'elephant', korean: '코끼리', emoji: '🐘', hint: '코가 긴' },
  ],
};

type Grade = 'grade1' | 'grade2' | 'grade3';

const gradeNames = {
  grade1: '초등 1-2학년',
  grade2: '초등 3-4학년',
  grade3: '초등 5-6학년',
};

export const EnglishWords = () => {
  const navigate = useNavigate();
  const { currentProfileId } = useProfileStore();
  const { addRecord } = useGameStore();

  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<typeof wordsByGrade.grade1>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [wrongWords, setWrongWords] = useState<typeof wordsByGrade.grade1>([]);

  // 문제 생성
  useEffect(() => {
    if (selectedGrade) {
      const words = wordsByGrade[selectedGrade];
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setStartTime(Date.now());
    }
  }, [selectedGrade]);

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;

    const question = questions[currentQuestion];
    const correct = userAnswer.toLowerCase().trim() === question.word.toLowerCase();

    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      setScore(score + 1);
      soundManager.playMatch();
    } else {
      soundManager.playMismatch();
      setWrongWords([...wrongWords, question]);
    }

    setTimeout(() => {
      if (currentQuestion + 1 >= questions.length) {
        // 게임 종료
        soundManager.playComplete();
        setShowResult(true);

        // 기록 저장
        if (currentProfileId) {
          const time = Math.floor((Date.now() - startTime) / 1000);
          addRecord({
            profileId: currentProfileId,
            gameType: 'memory',
            difficulty: selectedGrade === 'grade1' ? 'easy' : selectedGrade === 'grade2' ? 'medium' : 'hard',
            score: score + (correct ? 1 : 0),
            time,
            attempts: questions.length,
            accuracy: Math.round(((score + (correct ? 1 : 0)) / questions.length) * 100),
            completedAt: Date.now(),
          });
        }
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setShowAnswer(false);
        setIsCorrect(false);
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showAnswer) {
      handleSubmit();
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswer('');
    setShowResult(false);
    setShowAnswer(false);
    setIsCorrect(false);
    setSelectedGrade(null);
    setWrongWords([]);
  };

  // 학년 선택 화면
  if (!selectedGrade) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="🔤 영어 단어 외우기" showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">📚</div>
            <h2 className="text-2xl font-bold text-textDark">
              학년을 선택하세요
            </h2>
            <p className="text-gray-600">레벨에 맞는 단어를 공부해요!</p>
          </div>

          <div className="space-y-4">
            {Object.entries(gradeNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setSelectedGrade(key as Grade)}
                className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xl font-bold text-textDark mb-1">{name}</div>
                    <div className="text-sm text-gray-600">
                      {wordsByGrade[key as Grade].length}개 단어
                    </div>
                  </div>
                  <div className="text-3xl">→</div>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <h3 className="text-lg font-bold text-textDark mb-2">💡 공부 방법</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 그림과 힌트를 보고 영어 단어를 입력하세요</li>
              <li>• 철자를 정확하게 써야 해요</li>
              <li>• 틀린 단어는 나중에 다시 복습!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-background pb-20">
        <Header title="🔤 학습 완료!" showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-8xl">{passed ? '🎉' : '📖'}</div>
            <h2 className="text-3xl font-bold text-textDark">
              {passed ? '대단해요!' : '조금 더 연습해요!'}
            </h2>
            <div className="text-6xl font-bold text-primary">{percentage}점</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">맞힌 단어</span>
              <span className="font-bold text-success">{score}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">틀린 단어</span>
              <span className="font-bold text-primary">{questions.length - score}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">정확도</span>
              <span className="font-bold text-secondary">{percentage}%</span>
            </div>
          </div>

          {/* 틀린 단어 복습 */}
          {wrongWords.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="text-xl font-bold text-primary">📝 복습하세요!</h3>
              <div className="space-y-3">
                {wrongWords.map((word, index) => (
                  <div key={index} className="bg-background rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{word.emoji}</span>
                          <span className="font-bold text-textDark">{word.word}</span>
                        </div>
                        <div className="text-sm text-gray-600">{word.korean}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={handlePlayAgain} fullWidth>
              🔄 다시 공부
            </Button>
            <Button variant="primary" onClick={() => navigate('/')} fullWidth>
              🏠 홈으로
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 퀴즈 화면
  if (questions.length === 0) return null;

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={`🔤 ${gradeNames[selectedGrade]}`} showBack />

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 진행 상황 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-textDark">
              단어 {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-lg font-bold text-primary">⭐ {score}개</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 문제 */}
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center space-y-6">
          <div className="text-8xl">{question.emoji}</div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-primary">💡 {question.hint}</p>
            <p className="text-xl text-gray-600">{question.korean}</p>
          </div>
          <p className="text-lg text-textDark">
            이것을 <span className="font-bold text-secondary">영어</span>로?
          </p>
        </div>

        {/* 입력 */}
        {!showAnswer && (
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="영어로 입력하세요"
              className="w-full text-2xl font-bold text-center p-4 border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none"
              autoFocus
            />
            <Button
              variant="primary"
              onClick={handleSubmit}
              fullWidth
              disabled={!userAnswer.trim()}
            >
              ✓ 확인
            </Button>
          </div>
        )}

        {/* 정답/오답 표시 */}
        {showAnswer && (
          <div className={`${isCorrect ? 'bg-success' : 'bg-primary'} rounded-2xl p-6 text-center text-white space-y-3 animate-bounce`}>
            <div className="text-4xl">{isCorrect ? '✓' : '✗'}</div>
            <div className="text-2xl font-bold">
              {isCorrect ? '정답입니다!' : '아쉬워요!'}
            </div>
            {!isCorrect && (
              <div className="text-xl">
                정답: <span className="font-bold">{question.word}</span>
              </div>
            )}
            <div className="text-lg opacity-90">
              {question.emoji} {question.word} = {question.korean}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
