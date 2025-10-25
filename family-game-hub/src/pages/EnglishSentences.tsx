import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { soundManager } from '../utils/sound';
import { speechManager } from '../utils/speech';
import { Confetti } from '../components/effects/Confetti';
import { Character } from '../components/character/Character';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { useLevelStore } from '../store/levelStore';
import { LevelUpAnimation } from '../components/level/LevelUpAnimation';
import { XPProgressBar } from '../components/level/XPProgressBar';
import { allSentences, categoryBackgrounds as importedCategoryBackgrounds, type Sentence } from '../data/sentences';

// 학년별 문장 선택
const sentencesByGrade = {
  grade1: allSentences.filter(s => s.level === 1),
  grade2: allSentences.filter(s => s.level <= 2),
  grade3: allSentences,
};

type Grade = 'grade1' | 'grade2' | 'grade3';
type GameMode = 'ordering' | 'fillBlank' | 'choose';

const gradeNames = {
  grade1: '초등 1-2학년',
  grade2: '초등 3-4학년',
  grade3: '초등 5-6학년',
};

const modeNames = {
  ordering: '순서 맞추기 (쉬움)',
  fillBlank: '빈칸 채우기 (보통)',
  choose: '문장 선택하기 (어려움)',
};

const modeEmojis = {
  ordering: '🔤',
  fillBlank: '📝',
  choose: '🎯',
};

export const EnglishSentences = () => {
  const navigate = useNavigate();
  const { currentProfileId } = useProfileStore();
  const { addRecord } = useGameStore();
  const levelStore = useLevelStore();

  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [questions, setQuestions] = useState<Sentence[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [wrongSentences, setWrongSentences] = useState<Sentence[]>([]);

  // 레벨업 애니메이션
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [unlockedSentences, setUnlockedSentences] = useState(0);

  // 순서 맞추기 모드
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);

  // 빈칸/선택 모드
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // 애니메이션 효과
  const [showConfetti, setShowConfetti] = useState(false);
  const [characterState, setCharacterState] = useState<'idle' | 'happy' | 'sad' | 'thinking'>('idle');

  // 일일 진행률 체크
  useEffect(() => {
    levelStore.checkDailyProgress();
  }, []);

  // 문제 생성 (레벨에 따라 제한)
  useEffect(() => {
    if (selectedGrade && gameMode) {
      const availableSentences = sentencesByGrade[selectedGrade];
      const unlockedCount = levelStore.getUnlockedSentences();

      // 레벨에 따라 이용 가능한 문장만 선택
      const limitedSentences = availableSentences.slice(0, Math.min(unlockedCount, availableSentences.length));
      const shuffled = [...limitedSentences].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 15)); // 15문제
      setStartTime(Date.now());
    }
  }, [selectedGrade, gameMode, levelStore]);

  // 순서 맞추기 초기화
  useEffect(() => {
    if (gameMode === 'ordering' && questions.length > 0) {
      const sentence = questions[currentQuestion];
      const shuffled = [...sentence.words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
      setOrderedWords([]);
    }
  }, [currentQuestion, gameMode, questions]);

  const handleWordClick = (word: string) => {
    if (showAnswer) return;

    // 섞인 단어에서 순서대로 배열로 이동
    if (shuffledWords.includes(word)) {
      setOrderedWords([...orderedWords, word]);
      setShuffledWords(shuffledWords.filter(w => w !== word));
    } else {
      // 배열된 단어를 다시 섞인 단어로
      setShuffledWords([...shuffledWords, word]);
      setOrderedWords(orderedWords.filter(w => w !== word));
    }
  };

  const handleOrderingSubmit = () => {
    if (orderedWords.length !== questions[currentQuestion].words.length) return;

    const sentence = questions[currentQuestion];
    const userSentence = orderedWords.join(' ');
    const correct = userSentence === sentence.sentence;

    processAnswer(correct, sentence);
  };

  const handleFillBlankAnswer = (answer: string) => {
    if (selectedChoice) return;

    const sentence = questions[currentQuestion];
    const correct = answer === sentence.words[sentence.blankIndex];

    setSelectedChoice(answer);
    processAnswer(correct, sentence);
  };

  const handleChooseAnswer = (answer: string) => {
    if (selectedChoice) return;

    const sentence = questions[currentQuestion];
    const correct = answer === sentence.sentence;

    setSelectedChoice(answer);
    processAnswer(correct, sentence);
  };

  const processAnswer = (correct: boolean, sentence: Sentence) => {
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      soundManager.playMatch();
      setCharacterState('happy');
      setShowConfetti(true);

      // XP 추가 (기본 10XP + 연속 보너스 5XP)
      const xpEarned = 10 + (streak >= 3 ? 5 : 0);
      levelStore.addXP(xpEarned, sentence.category);
      levelStore.updateStreak(true);

      // 정답 문장 음성으로 읽기
      setTimeout(() => {
        speechManager.speak(sentence.sentence);
      }, 500);
    } else {
      setStreak(0);
      soundManager.playMismatch();
      setWrongSentences([...wrongSentences, sentence]);
      setCharacterState('sad');
      levelStore.updateStreak(false);

      // 정답 문장 음성으로 읽기
      setTimeout(() => {
        speechManager.speak(sentence.sentence);
      }, 1000);
    }

    // 자동 전환 제거 - 사용자가 "다음" 버튼을 눌러야 넘어감
  };

  const getChooseOptions = () => {
    const sentence = questions[currentQuestion];
    const otherSentences = allSentences
      .filter(s => s.sentence !== sentence.sentence && s.category === sentence.category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [sentence.sentence, ...otherSentences.map(s => s.sentence)]
      .sort(() => Math.random() - 0.5);
    return options;
  };

  const moveToNextQuestion = (correct: boolean) => {
    if (currentQuestion + 1 >= questions.length) {
      soundManager.playComplete();
      setShowResult(true);

      const finalScore = score + (correct ? 1 : 0);
      const time = Math.floor((Date.now() - startTime) / 1000);
      const percentage = Math.round((finalScore / questions.length) * 100);

      // 게임 기록 저장
      if (currentProfileId) {
        addRecord({
          profileId: currentProfileId,
          gameType: 'memory',
          difficulty: selectedGrade === 'grade1' ? 'easy' : selectedGrade === 'grade2' ? 'medium' : 'hard',
          score: finalScore,
          time,
          attempts: questions.length,
          accuracy: percentage,
          completedAt: Date.now(),
        });
      }

      // 배지 체크
      checkBadges(finalScore, questions.length, time);

      // 레벨업 체크
      const leveledUp = levelStore.checkLevelUp();
      if (leveledUp) {
        setNewLevel(levelStore.currentLevel);
        setUnlockedSentences(levelStore.getUnlockedSentences());
        setShowLevelUp(true);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
      setIsCorrect(false);
      setSelectedChoice(null);
      setOrderedWords([]);
      setShowConfetti(false);
      setCharacterState('idle');
    }
  };

  const checkBadges = (finalScore: number, totalQuestions: number, time: number) => {
    const percentage = (finalScore / totalQuestions) * 100;

    // 완벽주의자 배지 (100%)
    if (percentage === 100) {
      levelStore.unlockBadge({ id: 'perfect', name: '완벽주의자', description: '100% 정답으로 게임 완료', emoji: '💯' });
    }

    // 스피드러너 배지 (10문제 30초 이내)
    if (totalQuestions >= 10 && time <= 30) {
      levelStore.unlockBadge({ id: 'speed', name: '스피드러너', description: '30초 안에 10문제 클리어', emoji: '⏱️' });
    }
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setShowResult(false);
    setShowAnswer(false);
    setIsCorrect(false);
    setSelectedGrade(null);
    setGameMode(null);
    setWrongSentences([]);
    setSelectedChoice(null);
    setOrderedWords([]);
    setShuffledWords([]);
  };

  // 레벨업 애니메이션 종료
  const handleLevelUpComplete = () => {
    setShowLevelUp(false);
  };

  // 학년 선택 화면
  if (!selectedGrade) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="📖 영어 문장 만들기" showBack />

        {/* XP 진행률 바 */}
        <div className="max-w-2xl mx-auto p-4 pt-2">
          <XPProgressBar showDetails={true} compact={false} />
        </div>

        <div className="max-w-2xl mx-auto p-4 space-y-6 py-4">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">📝</div>
            <h2 className="text-2xl font-bold text-textDark">
              학년을 선택하세요
            </h2>
            <p className="text-gray-600">문장을 만들며 영어를 배워요!</p>
            <div className="bg-primary/10 rounded-xl p-3">
              <p className="text-sm text-primary font-bold">
                🔓 현재 {levelStore.getUnlockedSentences()}개 문장 해금!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(gradeNames).map(([key, name]) => {
              const availableSentences = sentencesByGrade[key as Grade];
              const unlockedCount = levelStore.getUnlockedSentences();
              const totalSentences = availableSentences.length;
              const accessibleSentences = Math.min(unlockedCount, totalSentences);

              return (
                <button
                  key={key}
                  onClick={() => setSelectedGrade(key as Grade)}
                  className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-xl font-bold text-textDark mb-1">{name}</div>
                      <div className="text-sm text-gray-600">
                        {accessibleSentences}/{totalSentences}개 문장 이용 가능
                      </div>
                    </div>
                    <div className="text-4xl">
                      {key === 'grade1' && '🌟'}
                      {key === 'grade2' && '⭐'}
                      {key === 'grade3' && '✨'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 일일 목표 */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-textDark">오늘의 목표</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{levelStore.dailyProgress} / {levelStore.dailyGoal} 문장</span>
                <span>{Math.round((levelStore.dailyProgress / levelStore.dailyGoal) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (levelStore.dailyProgress / levelStore.dailyGoal) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* 연속 출석 */}
          {levelStore.consecutiveDays > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="text-5xl mb-2">🔥</div>
              <div className="text-2xl font-bold text-primary mb-1">
                {levelStore.consecutiveDays}일 연속
              </div>
              <div className="text-sm text-gray-600">매일 공부하고 있어요!</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 모드 선택 화면
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-background">
        <Header title={`📖 ${gradeNames[selectedGrade]}`} showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎮</div>
            <h2 className="text-2xl font-bold text-textDark">
              게임 모드를 선택하세요
            </h2>
            <p className="text-gray-600">15문제가 출제됩니다!</p>
          </div>

          <div className="space-y-4">
            {Object.entries(modeNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setGameMode(key as GameMode)}
                className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xl font-bold text-textDark mb-2">
                      {modeEmojis[key as GameMode]} {name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {key === 'ordering' && '단어를 눌러 순서대로 배열해요'}
                      {key === 'fillBlank' && '빈칸에 들어갈 단어를 선택해요'}
                      {key === 'choose' && '상황에 맞는 문장을 골라요'}
                    </div>
                  </div>
                  <div className="text-3xl">→</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    const stars = percentage >= 90 ? '⭐⭐⭐' : percentage >= 70 ? '⭐⭐' : percentage >= 50 ? '⭐' : '';

    return (
      <>
        {/* 레벨업 애니메이션 */}
        {showLevelUp && (
          <LevelUpAnimation
            show={showLevelUp}
            newLevel={newLevel}
            unlockedSentences={unlockedSentences}
            onComplete={handleLevelUpComplete}
          />
        )}

        <div className="min-h-screen bg-background pb-20">
          <Header title="📖 학습 완료!" showBack />
          <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
            <div className="text-center space-y-4">
              <div className="text-8xl animate-bounce">{passed ? '🎉' : '📚'}</div>
              <h2 className="text-3xl font-bold text-textDark">
                {passed ? '완벽해요!' : '조금 더 연습해요!'}
              </h2>
              <div className="text-6xl font-bold text-primary">{percentage}점</div>
              {stars && <div className="text-5xl">{stars}</div>}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">맞힌 문장</span>
                <span className="font-bold text-success">{score}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">틀린 문장</span>
                <span className="font-bold text-primary">{questions.length - score}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">정확도</span>
                <span className="font-bold text-secondary">{percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">최고 연속 정답</span>
                <span className="font-bold text-success">🔥 {maxStreak}개</span>
              </div>
            </div>

            {/* XP 진행률 */}
            <XPProgressBar showDetails={true} compact={false} />

            {/* 틀린 문장 복습 */}
            {wrongSentences.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                <h3 className="text-xl font-bold text-primary">📝 복습하세요!</h3>
                <div className="space-y-3">
                  {wrongSentences.map((sentence, index) => (
                    <div key={index} className="bg-background rounded-xl p-4">
                      <div className="space-y-2">
                        <div className="font-bold text-lg text-textDark">{sentence.sentence}</div>
                        <div className="text-sm text-gray-600">{sentence.emoji} {sentence.korean}</div>
                        <button
                          onClick={() => speechManager.speak(sentence.sentence)}
                          className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-lg font-bold"
                        >
                          🔊 듣기
                        </button>
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
      </>
    );
  }

  // 퀴즈 화면
  if (questions.length === 0) return null;

  const sentence = questions[currentQuestion];
  const currentBackground = importedCategoryBackgrounds[sentence.category] || 'from-gray-100 to-white';

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentBackground} pb-20 transition-all duration-700`}>
      <Confetti show={showConfetti} />
      <Header title={`📖 ${modeEmojis[gameMode]} ${modeNames[gameMode]}`} showBack />

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 진행 상황 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-textDark">
              문장 {currentQuestion + 1} / {questions.length}
            </span>
            <div className="flex gap-3 items-center">
              {streak >= 3 && <span className="text-lg animate-bounce">🔥 {streak}연속!</span>}
              <span className="text-lg font-bold text-primary">⭐ {score}개</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 캐릭터 */}
        {!showAnswer && <Character state={characterState} size="medium" />}

        {/* 순서 맞추기 모드 */}
        {gameMode === 'ordering' && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center space-y-4">
              <div className="text-7xl" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
                {sentence.emoji}
              </div>
              <p className="text-2xl font-bold text-textDark">{sentence.korean}</p>
              <p className="text-lg text-gray-600">단어를 눌러 순서대로 배열하세요!</p>
              {/* 따라 읽기 버튼 */}
              <button
                onClick={() => speechManager.speak(sentence.korean, 'ko-KR')}
                className="bg-secondary/20 hover:bg-secondary/30 text-secondary px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
              >
                🔊 한글 듣기
              </button>
            </div>

            {/* 배열된 단어 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg min-h-[100px]">
              <div className="flex flex-wrap gap-2 justify-center">
                {orderedWords.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">여기에 단어를 배열하세요</p>
                ) : (
                  orderedWords.map((word, index) => (
                    <button
                      key={index}
                      onClick={() => handleWordClick(word)}
                      disabled={showAnswer}
                      className="bg-primary text-white px-5 py-3 rounded-xl font-bold text-lg shadow-md active:scale-95 transition-all"
                    >
                      {word}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* 섞인 단어 */}
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <div className="flex flex-wrap gap-2 justify-center">
                {shuffledWords.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordClick(word)}
                    disabled={showAnswer}
                    className="bg-gray-200 text-textDark px-5 py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {!showAnswer && orderedWords.length === sentence.words.length && (
              <Button variant="primary" onClick={handleOrderingSubmit} fullWidth>
                ✓ 확인
              </Button>
            )}
          </>
        )}

        {/* 빈칸 채우기 모드 */}
        {gameMode === 'fillBlank' && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center space-y-4">
              <div className="text-7xl" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
                {sentence.emoji}
              </div>
              <p className="text-xl text-gray-600">{sentence.korean}</p>
              <div className="text-2xl font-bold text-textDark">
                {sentence.words.map((word, index) => (
                  <span key={index}>
                    {index === sentence.blankIndex ? (
                      <span className="text-primary border-b-4 border-primary px-2">____</span>
                    ) : (
                      word
                    )}
                    {index < sentence.words.length - 1 && ' '}
                  </span>
                ))}
              </div>
              <p className="text-lg text-gray-600">빈칸에 들어갈 단어는?</p>
              {/* 따라 읽기 버튼 */}
              <button
                onClick={() => speechManager.speak(sentence.korean, 'ko-KR')}
                className="bg-secondary/20 hover:bg-secondary/30 text-secondary px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
              >
                🔊 한글 듣기
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {sentence.blankOptions.map((option, index) => {
                const isSelected = selectedChoice === option;
                const isAnswer = option === sentence.words[sentence.blankIndex];

                let bgColor = 'bg-white';
                if (showAnswer) {
                  if (isSelected && isCorrect) bgColor = 'bg-success';
                  else if (isSelected && !isCorrect) bgColor = 'bg-primary';
                  else if (isAnswer) bgColor = 'bg-success';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleFillBlankAnswer(option)}
                    disabled={!!selectedChoice}
                    className={`${bgColor} rounded-xl p-5 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed`}
                  >
                    <div className="text-xl font-bold text-textDark">{option}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* 문장 선택하기 모드 */}
        {gameMode === 'choose' && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center space-y-4">
              <div className="text-7xl animate-bounce" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
                {sentence.emoji}
              </div>
              <p className="text-2xl font-bold text-primary">{sentence.situation}</p>
              <p className="text-lg text-gray-600">이 상황에 맞는 영어 문장은?</p>
              {/* 따라 읽기 버튼 */}
              <button
                onClick={() => speechManager.speak(sentence.korean, 'ko-KR')}
                className="bg-secondary/20 hover:bg-secondary/30 text-secondary px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
              >
                🔊 한글 듣기
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {getChooseOptions().map((option, index) => {
                const isSelected = selectedChoice === option;
                const isAnswer = option === sentence.sentence;

                let bgColor = 'bg-white';
                if (showAnswer) {
                  if (isSelected && isCorrect) bgColor = 'bg-success';
                  else if (isSelected && !isCorrect) bgColor = 'bg-primary';
                  else if (isAnswer) bgColor = 'bg-success';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleChooseAnswer(option)}
                    disabled={!!selectedChoice}
                    className={`${bgColor} rounded-xl p-5 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed`}
                  >
                    <div className="text-lg font-bold text-textDark">{option}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* 정답/오답 표시 */}
        {showAnswer && (
          <>
            <Character state={characterState} size="large" />
            <div className={`${isCorrect ? 'bg-success' : 'bg-primary'} rounded-2xl p-6 text-center text-white space-y-3`}>
              <div className="text-5xl">{isCorrect ? '✓' : '✗'}</div>
              <div className="text-2xl font-bold">
                {isCorrect ? (
                  streak >= 5 ? '🔥 완벽해요!' : '정답입니다!'
                ) : (
                  '아쉬워요!'
                )}
              </div>
              {!isCorrect && (
                <div className="text-xl">
                  정답: <span className="font-bold">{sentence.sentence}</span>
                </div>
              )}
              <div className="text-lg opacity-90">
                {sentence.emoji} {sentence.korean}
              </div>
              {/* 따라 읽기 버튼 */}
              <button
                onClick={() => speechManager.speak(sentence.sentence)}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-bold transition-all active:scale-95 mt-2"
              >
                🔊 영어로 따라 읽기
              </button>
            </div>

            {/* 다음 문제 버튼 */}
            <Button
              variant="primary"
              onClick={() => moveToNextQuestion(isCorrect)}
              fullWidth
            >
              {currentQuestion + 1 >= questions.length ? '✓ 완료' : '➡️ 다음 문제'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
