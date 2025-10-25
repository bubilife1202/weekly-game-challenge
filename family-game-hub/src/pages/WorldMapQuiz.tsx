import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { soundManager } from '../utils/sound';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';

// 나라 데이터
const countries = [
  // 아시아
  { name: '대한민국', capital: '서울', continent: 'asia', flag: '🇰🇷', hint: '김치의 나라' },
  { name: '일본', capital: '도쿄', continent: 'asia', flag: '🇯🇵', hint: '초밥과 사무라이' },
  { name: '중국', capital: '베이징', continent: 'asia', flag: '🇨🇳', hint: '만리장성' },
  { name: '인도', capital: '뉴델리', continent: 'asia', flag: '🇮🇳', hint: '타지마할' },
  { name: '태국', capital: '방콕', continent: 'asia', flag: '🇹🇭', hint: '똠얌꿍' },
  { name: '베트남', capital: '하노이', continent: 'asia', flag: '🇻🇳', hint: '쌀국수' },
  { name: '필리핀', capital: '마닐라', continent: 'asia', flag: '🇵🇭', hint: '7000개의 섬' },
  { name: '싱가포르', capital: '싱가포르', continent: 'asia', flag: '🇸🇬', hint: '사자의 도시' },

  // 유럽
  { name: '영국', capital: '런던', continent: 'europe', flag: '🇬🇧', hint: '빅벤' },
  { name: '프랑스', capital: '파리', continent: 'europe', flag: '🇫🇷', hint: '에펠탑' },
  { name: '독일', capital: '베를린', continent: 'europe', flag: '🇩🇪', hint: '맥주와 소시지' },
  { name: '이탈리아', capital: '로마', continent: 'europe', flag: '🇮🇹', hint: '피자와 파스타' },
  { name: '스페인', capital: '마드리드', continent: 'europe', flag: '🇪🇸', hint: '투우' },
  { name: '러시아', capital: '모스크바', continent: 'europe', flag: '🇷🇺', hint: '세계에서 가장 큰 나라' },
  { name: '네덜란드', capital: '암스테르담', continent: 'europe', flag: '🇳🇱', hint: '튤립과 풍차' },
  { name: '스위스', capital: '베른', continent: 'europe', flag: '🇨🇭', hint: '알프스 산맥' },

  // 아메리카
  { name: '미국', capital: '워싱턴 D.C.', continent: 'america', flag: '🇺🇸', hint: '자유의 여신상' },
  { name: '캐나다', capital: '오타와', continent: 'america', flag: '🇨🇦', hint: '단풍잎' },
  { name: '멕시코', capital: '멕시코시티', continent: 'america', flag: '🇲🇽', hint: '타코' },
  { name: '브라질', capital: '브라질리아', continent: 'america', flag: '🇧🇷', hint: '삼바 축구' },
  { name: '아르헨티나', capital: '부에노스아이레스', continent: 'america', flag: '🇦🇷', hint: '탱고' },

  // 오세아니아
  { name: '호주', capital: '캔버라', continent: 'oceania', flag: '🇦🇺', hint: '캥거루' },
  { name: '뉴질랜드', capital: '웰링턴', continent: 'oceania', flag: '🇳🇿', hint: '키위' },

  // 아프리카
  { name: '이집트', capital: '카이로', continent: 'africa', flag: '🇪🇬', hint: '피라미드' },
  { name: '남아프리카공화국', capital: '프리토리아', continent: 'africa', flag: '🇿🇦', hint: '다이아몬드' },
  { name: '케냐', capital: '나이로비', continent: 'africa', flag: '🇰🇪', hint: '사파리' },
];

type QuizMode = 'capital' | 'flag' | 'country';
type Continent = 'all' | 'asia' | 'europe' | 'america' | 'oceania' | 'africa';

const continentNames = {
  all: '전 세계',
  asia: '아시아',
  europe: '유럽',
  america: '아메리카',
  oceania: '오세아니아',
  africa: '아프리카',
};

export const WorldMapQuiz = () => {
  const navigate = useNavigate();
  const { currentProfileId } = useProfileStore();
  const { addRecord } = useGameStore();

  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [quizMode, setQuizMode] = useState<QuizMode | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<typeof countries>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  // 문제 생성
  useEffect(() => {
    if (selectedContinent && quizMode) {
      const filtered = selectedContinent === 'all'
        ? countries
        : countries.filter(c => c.continent === selectedContinent);

      // 섞기
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 10)); // 10문제
      setStartTime(Date.now());
    }
  }, [selectedContinent, quizMode]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // 이미 답변한 경우

    const question = questions[currentQuestion];
    let correct = false;

    if (quizMode === 'capital') {
      correct = answer === question.capital;
    } else if (quizMode === 'flag') {
      correct = answer === question.name;
    } else if (quizMode === 'country') {
      correct = answer === question.name;
    }

    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      soundManager.playMatch();
    } else {
      soundManager.playMismatch();
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
            difficulty: 'easy',
            score: score + (correct ? 1 : 0),
            time,
            attempts: questions.length,
            accuracy: Math.round(((score + (correct ? 1 : 0)) / questions.length) * 100),
            completedAt: Date.now(),
          });
        }
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(false);
      }
    }, 1500);
  };

  const getOptions = () => {
    const question = questions[currentQuestion];
    let options: string[] = [];

    if (quizMode === 'capital') {
      // 수도 선택지
      const otherCapitals = countries
        .filter(c => c.name !== question.name)
        .map(c => c.capital)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      options = [question.capital, ...otherCapitals].sort(() => Math.random() - 0.5);
    } else if (quizMode === 'flag' || quizMode === 'country') {
      // 나라 선택지
      const otherCountries = countries
        .filter(c => c.name !== question.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      options = [question.name, ...otherCountries.map(c => c.name)].sort(() => Math.random() - 0.5);
    }

    return options;
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setQuizMode(null);
    setSelectedContinent(null);
  };

  // 대륙 선택 화면
  if (!selectedContinent) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="🌍 세계 지도 퀴즈" showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">🌍</div>
            <h2 className="text-2xl font-bold text-textDark">
              어느 대륙을 공부할까요?
            </h2>
            <p className="text-gray-600">세계 지리를 배워보세요!</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(continentNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setSelectedContinent(key as Continent)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl">
                    {key === 'all' && '🌏'}
                    {key === 'asia' && '🏯'}
                    {key === 'europe' && '🏰'}
                    {key === 'america' && '🗽'}
                    {key === 'oceania' && '🦘'}
                    {key === 'africa' && '🦁'}
                  </div>
                  <div className="text-lg font-bold text-textDark">{name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 모드 선택 화면
  if (!quizMode) {
    return (
      <div className="min-h-screen bg-background">
        <Header title={`🌍 ${continentNames[selectedContinent]}`} showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">📚</div>
            <h2 className="text-2xl font-bold text-textDark">
              어떤 퀴즈를 풀까요?
            </h2>
            <p className="text-gray-600">10문제가 출제됩니다!</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setQuizMode('capital')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-xl font-bold text-textDark mb-1">
                    🏛 수도 맞추기
                  </div>
                  <div className="text-sm text-gray-600">
                    나라를 보고 수도를 맞춰요
                  </div>
                </div>
                <div className="text-3xl">→</div>
              </div>
            </button>

            <button
              onClick={() => setQuizMode('flag')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-xl font-bold text-textDark mb-1">
                    🚩 국기 맞추기
                  </div>
                  <div className="text-sm text-gray-600">
                    국기를 보고 나라를 맞춰요
                  </div>
                </div>
                <div className="text-3xl">→</div>
              </div>
            </button>

            <button
              onClick={() => setQuizMode('country')}
              className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-xl font-bold text-textDark mb-1">
                    💡 힌트로 맞추기
                  </div>
                  <div className="text-sm text-gray-600">
                    힌트를 보고 나라를 맞춰요
                  </div>
                </div>
                <div className="text-3xl">→</div>
              </div>
            </button>
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
      <div className="min-h-screen bg-background">
        <Header title="🌍 퀴즈 완료!" showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-8xl">{passed ? '🎉' : '📚'}</div>
            <h2 className="text-3xl font-bold text-textDark">
              {passed ? '훌륭해요!' : '조금 더 공부해요!'}
            </h2>
            <div className="text-6xl font-bold text-primary">{percentage}점</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">맞힌 문제</span>
              <span className="font-bold text-success">{score}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">틀린 문제</span>
              <span className="font-bold text-primary">{questions.length - score}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">정확도</span>
              <span className="font-bold text-secondary">{percentage}%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" onClick={handlePlayAgain} fullWidth>
              🔄 다시 풀기
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
  const options = getOptions();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={`🌍 ${continentNames[selectedContinent]}`} showBack />

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 진행 상황 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-textDark">
              문제 {currentQuestion + 1} / {questions.length}
            </span>
            <span className="text-lg font-bold text-primary">⭐ {score}점</span>
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
          {quizMode === 'capital' && (
            <>
              <div className="text-7xl mb-4" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
                {question.flag}
              </div>
              <p className="text-2xl font-bold text-textDark">{question.name}의 수도는?</p>
            </>
          )}
          {quizMode === 'flag' && (
            <>
              <div className="text-9xl mb-4" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
                {question.flag}
              </div>
              <p className="text-2xl font-bold text-textDark mb-2">이 국기는 어느 나라?</p>
              <p className="text-sm text-gray-500">힌트: {question.hint}</p>
            </>
          )}
          {quizMode === 'country' && (
            <>
              <div className="text-6xl">💡</div>
              <p className="text-xl font-bold text-primary">"{question.hint}"</p>
              <p className="text-xl text-gray-600">힌트를 보고 나라를 맞춰보세요!</p>
            </>
          )}
        </div>

        {/* 선택지 */}
        <div className="grid grid-cols-1 gap-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isAnswer = quizMode === 'capital'
              ? option === question.capital
              : option === question.name;

            let bgColor = 'bg-white';
            if (selectedAnswer) {
              if (isSelected && isCorrect) bgColor = 'bg-success';
              else if (isSelected && !isCorrect) bgColor = 'bg-primary';
              else if (isAnswer) bgColor = 'bg-success';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer}
                className={`${bgColor} rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:cursor-not-allowed`}
              >
                <div className="text-lg font-bold text-textDark">{option}</div>
              </button>
            );
          })}
        </div>

        {/* 정답/오답 표시 */}
        {selectedAnswer && (
          <div className={`${isCorrect ? 'bg-success' : 'bg-primary'} rounded-xl p-4 text-center text-white font-bold text-xl animate-bounce`}>
            {isCorrect ? '✓ 정답!' : `✗ 틀렸어요! 정답: ${quizMode === 'capital' ? question.capital : question.name}`}
          </div>
        )}
      </div>
    </div>
  );
};
