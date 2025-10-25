import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { soundManager } from '../utils/sound';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';

// 영어 단어 데이터 (카테고리별)
type Word = {
  word: string;
  korean: string;
  emoji: string;
  hint: string;
  category: string;
};

const allWords: Word[] = [
  // 동물 (Animals)
  { word: 'cat', korean: '고양이', emoji: '🐱', hint: '야옹야옹', category: 'animals' },
  { word: 'dog', korean: '강아지', emoji: '🐶', hint: '멍멍', category: 'animals' },
  { word: 'bird', korean: '새', emoji: '🐦', hint: '날아다니는', category: 'animals' },
  { word: 'fish', korean: '물고기', emoji: '🐠', hint: '헤엄치는', category: 'animals' },
  { word: 'elephant', korean: '코끼리', emoji: '🐘', hint: '코가 긴', category: 'animals' },
  { word: 'lion', korean: '사자', emoji: '🦁', hint: '정글의 왕', category: 'animals' },
  { word: 'tiger', korean: '호랑이', emoji: '🐯', hint: '줄무늬', category: 'animals' },
  { word: 'monkey', korean: '원숭이', emoji: '🐵', hint: '바나나를 좋아하는', category: 'animals' },
  { word: 'rabbit', korean: '토끼', emoji: '🐰', hint: '깡총깡총', category: 'animals' },
  { word: 'bear', korean: '곰', emoji: '🐻', hint: '꿀을 좋아하는', category: 'animals' },
  { word: 'pig', korean: '돼지', emoji: '🐷', hint: '꿀꿀', category: 'animals' },
  { word: 'cow', korean: '소', emoji: '🐮', hint: '우유를 주는', category: 'animals' },
  { word: 'horse', korean: '말', emoji: '🐴', hint: '히히힝', category: 'animals' },
  { word: 'sheep', korean: '양', emoji: '🐑', hint: '메에~', category: 'animals' },
  { word: 'duck', korean: '오리', emoji: '🦆', hint: '꽥꽥', category: 'animals' },
  { word: 'frog', korean: '개구리', emoji: '🐸', hint: '개골개골', category: 'animals' },
  { word: 'bee', korean: '벌', emoji: '🐝', hint: '윙윙', category: 'animals' },
  { word: 'butterfly', korean: '나비', emoji: '🦋', hint: '예쁜 날개', category: 'animals' },

  // 음식 (Food)
  { word: 'apple', korean: '사과', emoji: '🍎', hint: '빨간 과일', category: 'food' },
  { word: 'banana', korean: '바나나', emoji: '🍌', hint: '노란 과일', category: 'food' },
  { word: 'orange', korean: '오렌지', emoji: '🍊', hint: '주황색 과일', category: 'food' },
  { word: 'grape', korean: '포도', emoji: '🍇', hint: '송이송이', category: 'food' },
  { word: 'watermelon', korean: '수박', emoji: '🍉', hint: '여름 과일', category: 'food' },
  { word: 'strawberry', korean: '딸기', emoji: '🍓', hint: '빨갛고 달콤한', category: 'food' },
  { word: 'pizza', korean: '피자', emoji: '🍕', hint: '동그란 음식', category: 'food' },
  { word: 'hamburger', korean: '햄버거', emoji: '🍔', hint: '빵 사이에', category: 'food' },
  { word: 'bread', korean: '빵', emoji: '🍞', hint: '아침 식사', category: 'food' },
  { word: 'cake', korean: '케이크', emoji: '🎂', hint: '생일에', category: 'food' },
  { word: 'cookie', korean: '쿠키', emoji: '🍪', hint: '바삭한 과자', category: 'food' },
  { word: 'ice cream', korean: '아이스크림', emoji: '🍦', hint: '차가운 간식', category: 'food' },
  { word: 'milk', korean: '우유', emoji: '🥛', hint: '하얀 음료', category: 'food' },
  { word: 'water', korean: '물', emoji: '💧', hint: '마시는 것', category: 'food' },
  { word: 'egg', korean: '달걀', emoji: '🥚', hint: '닭이 낳는', category: 'food' },
  { word: 'cheese', korean: '치즈', emoji: '🧀', hint: '쥐가 좋아하는', category: 'food' },

  // 색깔 (Colors)
  { word: 'red', korean: '빨강', emoji: '🔴', hint: '사과 색', category: 'colors' },
  { word: 'blue', korean: '파랑', emoji: '🔵', hint: '하늘 색', category: 'colors' },
  { word: 'yellow', korean: '노랑', emoji: '🟡', hint: '바나나 색', category: 'colors' },
  { word: 'green', korean: '초록', emoji: '🟢', hint: '나뭇잎 색', category: 'colors' },
  { word: 'black', korean: '검정', emoji: '⚫', hint: '밤 색', category: 'colors' },
  { word: 'white', korean: '하양', emoji: '⚪', hint: '눈 색', category: 'colors' },
  { word: 'pink', korean: '분홍', emoji: '🩷', hint: '귀여운 색', category: 'colors' },
  { word: 'orange', korean: '주황', emoji: '🟠', hint: '오렌지 색', category: 'colors' },
  { word: 'purple', korean: '보라', emoji: '🟣', hint: '포도 색', category: 'colors' },
  { word: 'brown', korean: '갈색', emoji: '🟤', hint: '초콜릿 색', category: 'colors' },

  // 가족 (Family)
  { word: 'family', korean: '가족', emoji: '👨‍👩‍👧‍👦', hint: '엄마 아빠', category: 'family' },
  { word: 'mother', korean: '엄마', emoji: '👩', hint: '아이를 낳아주신 분', category: 'family' },
  { word: 'father', korean: '아빠', emoji: '👨', hint: '가장', category: 'family' },
  { word: 'baby', korean: '아기', emoji: '👶', hint: '응애~', category: 'family' },
  { word: 'brother', korean: '형제', emoji: '👦', hint: '남자 형제', category: 'family' },
  { word: 'sister', korean: '자매', emoji: '👧', hint: '여자 형제', category: 'family' },
  { word: 'friend', korean: '친구', emoji: '👫', hint: '같이 노는', category: 'family' },

  // 학교 (School)
  { word: 'school', korean: '학교', emoji: '🏫', hint: '공부하는 곳', category: 'school' },
  { word: 'teacher', korean: '선생님', emoji: '👨‍🏫', hint: '가르치는 사람', category: 'school' },
  { word: 'student', korean: '학생', emoji: '🧑‍🎓', hint: '배우는 사람', category: 'school' },
  { word: 'book', korean: '책', emoji: '📚', hint: '읽는 것', category: 'school' },
  { word: 'pencil', korean: '연필', emoji: '✏️', hint: '쓰는 것', category: 'school' },
  { word: 'pen', korean: '펜', emoji: '🖊️', hint: '쓰는 것', category: 'school' },
  { word: 'eraser', korean: '지우개', emoji: '🧹', hint: '지우는 것', category: 'school' },
  { word: 'ruler', korean: '자', emoji: '📏', hint: '재는 것', category: 'school' },
  { word: 'bag', korean: '가방', emoji: '🎒', hint: '책을 담는', category: 'school' },
  { word: 'computer', korean: '컴퓨터', emoji: '💻', hint: '게임하는 것', category: 'school' },

  // 자연 (Nature)
  { word: 'sun', korean: '태양', emoji: '☀️', hint: '뜨겁고 밝은', category: 'nature' },
  { word: 'moon', korean: '달', emoji: '🌙', hint: '밤에 보이는', category: 'nature' },
  { word: 'star', korean: '별', emoji: '⭐', hint: '반짝반짝', category: 'nature' },
  { word: 'cloud', korean: '구름', emoji: '☁️', hint: '하늘에 둥둥', category: 'nature' },
  { word: 'rain', korean: '비', emoji: '🌧️', hint: '우산이 필요해', category: 'nature' },
  { word: 'snow', korean: '눈', emoji: '❄️', hint: '겨울에 내리는', category: 'nature' },
  { word: 'tree', korean: '나무', emoji: '🌳', hint: '푸르른', category: 'nature' },
  { word: 'flower', korean: '꽃', emoji: '🌸', hint: '예쁜 식물', category: 'nature' },
  { word: 'grass', korean: '풀', emoji: '🌱', hint: '초록색 식물', category: 'nature' },
  { word: 'mountain', korean: '산', emoji: '⛰️', hint: '높은 곳', category: 'nature' },
  { word: 'river', korean: '강', emoji: '🏞️', hint: '물이 흐르는', category: 'nature' },
  { word: 'sea', korean: '바다', emoji: '🌊', hint: '넓고 푸른', category: 'nature' },
  { word: 'rainbow', korean: '무지개', emoji: '🌈', hint: '7가지 색', category: 'nature' },

  // 신체 (Body)
  { word: 'head', korean: '머리', emoji: '🗣️', hint: '위에 있는', category: 'body' },
  { word: 'eye', korean: '눈', emoji: '👁️', hint: '보는 것', category: 'body' },
  { word: 'nose', korean: '코', emoji: '👃', hint: '냄새 맡는', category: 'body' },
  { word: 'mouth', korean: '입', emoji: '👄', hint: '먹는 것', category: 'body' },
  { word: 'ear', korean: '귀', emoji: '👂', hint: '듣는 것', category: 'body' },
  { word: 'hand', korean: '손', emoji: '✋', hint: '잡는 것', category: 'body' },
  { word: 'foot', korean: '발', emoji: '🦶', hint: '걷는 것', category: 'body' },
  { word: 'arm', korean: '팔', emoji: '💪', hint: '힘쓰는', category: 'body' },
  { word: 'leg', korean: '다리', emoji: '🦵', hint: '서는 것', category: 'body' },

  // 장소 (Places)
  { word: 'house', korean: '집', emoji: '🏠', hint: '사는 곳', category: 'places' },
  { word: 'hospital', korean: '병원', emoji: '🏥', hint: '아플 때 가는 곳', category: 'places' },
  { word: 'restaurant', korean: '식당', emoji: '🍽️', hint: '밥 먹는 곳', category: 'places' },
  { word: 'park', korean: '공원', emoji: '🏞️', hint: '놀이터가 있는', category: 'places' },
  { word: 'store', korean: '가게', emoji: '🏪', hint: '물건 사는 곳', category: 'places' },
  { word: 'library', korean: '도서관', emoji: '📚', hint: '책 읽는 곳', category: 'places' },

  // 교통 (Transportation)
  { word: 'car', korean: '자동차', emoji: '🚗', hint: '부릉부릉', category: 'transportation' },
  { word: 'bus', korean: '버스', emoji: '🚌', hint: '큰 차', category: 'transportation' },
  { word: 'train', korean: '기차', emoji: '🚂', hint: '칙칙폭폭', category: 'transportation' },
  { word: 'airplane', korean: '비행기', emoji: '✈️', hint: '하늘을 나는', category: 'transportation' },
  { word: 'bicycle', korean: '자전거', emoji: '🚲', hint: '페달을 밟는', category: 'transportation' },
  { word: 'ship', korean: '배', emoji: '🚢', hint: '물에 뜨는', category: 'transportation' },

  // 스포츠 (Sports)
  { word: 'ball', korean: '공', emoji: '⚽', hint: '던지는 것', category: 'sports' },
  { word: 'soccer', korean: '축구', emoji: '⚽', hint: '발로 차는', category: 'sports' },
  { word: 'basketball', korean: '농구', emoji: '🏀', hint: '골대에 넣는', category: 'sports' },
  { word: 'baseball', korean: '야구', emoji: '⚾', hint: '방망이로 치는', category: 'sports' },
  { word: 'swimming', korean: '수영', emoji: '🏊', hint: '물에서 하는', category: 'sports' },

  // 기타 (Others)
  { word: 'toy', korean: '장난감', emoji: '🧸', hint: '노는 것', category: 'others' },
  { word: 'umbrella', korean: '우산', emoji: '☂️', hint: '비 올 때', category: 'others' },
  { word: 'clock', korean: '시계', emoji: '🕐', hint: '시간을 보는', category: 'others' },
  { word: 'phone', korean: '전화', emoji: '📱', hint: '통화하는', category: 'others' },
  { word: 'camera', korean: '카메라', emoji: '📷', hint: '사진 찍는', category: 'others' },
  { word: 'music', korean: '음악', emoji: '🎵', hint: '듣는 것', category: 'others' },
  { word: 'birthday', korean: '생일', emoji: '🎂', hint: '케이크 먹는 날', category: 'others' },
  { word: 'gift', korean: '선물', emoji: '🎁', hint: '받는 것', category: 'others' },
  { word: 'door', korean: '문', emoji: '🚪', hint: '여는 것', category: 'others' },
  { word: 'window', korean: '창문', emoji: '🪟', hint: '밖을 보는', category: 'others' },
  { word: 'chair', korean: '의자', emoji: '🪑', hint: '앉는 것', category: 'others' },
  { word: 'table', korean: '책상', emoji: '🪑', hint: '공부하는 곳', category: 'others' },
];

// 학년별 단어 선택
const wordsByGrade = {
  grade1: allWords.filter(w =>
    ['animals', 'food', 'colors', 'nature'].includes(w.category)
  ).slice(0, 40),
  grade2: allWords.filter(w =>
    ['animals', 'food', 'colors', 'family', 'school', 'body', 'nature'].includes(w.category)
  ).slice(0, 50),
  grade3: allWords,
};

type Grade = 'grade1' | 'grade2' | 'grade3';
type GameMode = 'choice' | 'typing' | 'listening';

const gradeNames = {
  grade1: '초등 1-2학년',
  grade2: '초등 3-4학년',
  grade3: '초등 5-6학년',
};

const modeNames = {
  choice: '4지선다 (쉬움)',
  typing: '철자 맞추기 (보통)',
  listening: '듣기 모드 (어려움)',
};

const modeEmojis = {
  choice: '✨',
  typing: '⌨️',
  listening: '👂',
};

export const EnglishWords = () => {
  const navigate = useNavigate();
  const { currentProfileId } = useProfileStore();
  const { addRecord } = useGameStore();

  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0); // 연속 정답
  const [maxStreak, setMaxStreak] = useState(0); // 최고 연속 정답
  const [questions, setQuestions] = useState<Word[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [wrongWords, setWrongWords] = useState<Word[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // 문제 생성
  useEffect(() => {
    if (selectedGrade && gameMode) {
      const words = wordsByGrade[selectedGrade];
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 20)); // 20문제
      setStartTime(Date.now());
    }
  }, [selectedGrade, gameMode]);

  const handleChoiceAnswer = (answer: string) => {
    if (selectedChoice) return; // 이미 선택한 경우

    const question = questions[currentQuestion];
    const correct = answer === question.korean;

    setSelectedChoice(answer);
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      soundManager.playMatch();
    } else {
      setStreak(0);
      soundManager.playMismatch();
      setWrongWords([...wrongWords, question]);
    }

    setTimeout(() => {
      moveToNextQuestion(correct);
    }, 2000);
  };

  const handleTypingSubmit = () => {
    if (!userAnswer.trim() || showAnswer) return;

    const question = questions[currentQuestion];
    const correct = userAnswer.toLowerCase().trim() === question.word.toLowerCase();

    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      soundManager.playMatch();
    } else {
      setStreak(0);
      soundManager.playMismatch();
      setWrongWords([...wrongWords, question]);
    }

    setTimeout(() => {
      moveToNextQuestion(correct);
    }, 2500);
  };

  const handleListeningAnswer = (answer: string) => {
    if (selectedChoice) return;

    const question = questions[currentQuestion];
    const correct = answer === question.word;

    setSelectedChoice(answer);
    setIsCorrect(correct);
    setShowAnswer(true);

    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      soundManager.playMatch();
    } else {
      setStreak(0);
      soundManager.playMismatch();
      setWrongWords([...wrongWords, question]);
    }

    setTimeout(() => {
      moveToNextQuestion(correct);
    }, 2000);
  };

  const moveToNextQuestion = (correct: boolean) => {
    if (currentQuestion + 1 >= questions.length) {
      // 게임 종료
      soundManager.playComplete();
      setShowResult(true);

      // 기록 저장
      if (currentProfileId) {
        const time = Math.floor((Date.now() - startTime) / 1000);
        const finalScore = score + (correct ? 1 : 0);
        addRecord({
          profileId: currentProfileId,
          gameType: 'memory',
          difficulty: selectedGrade === 'grade1' ? 'easy' : selectedGrade === 'grade2' ? 'medium' : 'hard',
          score: finalScore,
          time,
          attempts: questions.length,
          accuracy: Math.round((finalScore / questions.length) * 100),
          completedAt: Date.now(),
        });
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(false);
      setSelectedChoice(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showAnswer && gameMode === 'typing') {
      handleTypingSubmit();
    }
  };

  const getChoiceOptions = () => {
    const question = questions[currentQuestion];
    const otherWords = allWords
      .filter(w => w.korean !== question.korean)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [question.korean, ...otherWords.map(w => w.korean)]
      .sort(() => Math.random() - 0.5);
    return options;
  };

  const getListeningOptions = () => {
    const question = questions[currentQuestion];
    const otherWords = allWords
      .filter(w => w.word !== question.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [question.word, ...otherWords.map(w => w.word)]
      .sort(() => Math.random() - 0.5);
    return options;
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setUserAnswer('');
    setShowResult(false);
    setShowAnswer(false);
    setIsCorrect(false);
    setSelectedGrade(null);
    setGameMode(null);
    setWrongWords([]);
    setSelectedChoice(null);
  };

  // 학년 선택 화면
  if (!selectedGrade) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="🔤 영어 단어 외우기" showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">📚</div>
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
                      {wordsByGrade[key as Grade].length}개 단어 수록
                    </div>
                  </div>
                  <div className="text-4xl">
                    {key === 'grade1' && '🌟'}
                    {key === 'grade2' && '⭐'}
                    {key === 'grade3' && '✨'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 모드 선택 화면
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-background">
        <Header title={`🔤 ${gradeNames[selectedGrade]}`} showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">🎮</div>
            <h2 className="text-2xl font-bold text-textDark">
              게임 모드를 선택하세요
            </h2>
            <p className="text-gray-600">20문제가 출제됩니다!</p>
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
                      {key === 'choice' && '4개 보기 중에서 골라요'}
                      {key === 'typing' && '영어 철자를 직접 입력해요'}
                      {key === 'listening' && '한국어 뜻을 보고 영어를 골라요'}
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
      <div className="min-h-screen bg-background pb-20">
        <Header title="🔤 학습 완료!" showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-8xl animate-bounce">{passed ? '🎉' : '📖'}</div>
            <h2 className="text-3xl font-bold text-textDark">
              {passed ? '대단해요!' : '조금 더 연습해요!'}
            </h2>
            <div className="text-6xl font-bold text-primary">{percentage}점</div>
            {stars && <div className="text-5xl">{stars}</div>}
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
            <div className="flex justify-between">
              <span className="text-gray-600">최고 연속 정답</span>
              <span className="font-bold text-success">🔥 {maxStreak}개</span>
            </div>
          </div>

          {/* 틀린 단어 복습 */}
          {wrongWords.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
              <h3 className="text-xl font-bold text-primary">📝 복습하세요!</h3>
              <div className="space-y-3">
                {wrongWords.map((word, index) => (
                  <div key={index} className="bg-background rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{word.emoji}</span>
                        <div>
                          <div className="font-bold text-lg text-textDark">{word.word}</div>
                          <div className="text-sm text-gray-600">{word.korean} ({word.hint})</div>
                        </div>
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
      <Header title={`🔤 ${modeEmojis[gameMode]} ${modeNames[gameMode]}`} showBack />

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 진행 상황 */}
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-textDark">
              단어 {currentQuestion + 1} / {questions.length}
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

        {/* 4지선다 모드 */}
        {gameMode === 'choice' && (
          <>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center space-y-6">
              <div className="text-9xl animate-bounce" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
                {question.emoji}
              </div>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">{question.word}</p>
                <p className="text-lg text-gray-600">💡 {question.hint}</p>
              </div>
              <p className="text-xl text-textDark">
                이것은 <span className="font-bold text-secondary">무엇</span>일까요?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {getChoiceOptions().map((option, index) => {
                const isSelected = selectedChoice === option;
                const isAnswer = option === question.korean;

                let bgColor = 'bg-white';
                if (showAnswer) {
                  if (isSelected && isCorrect) bgColor = 'bg-success';
                  else if (isSelected && !isCorrect) bgColor = 'bg-primary';
                  else if (isAnswer) bgColor = 'bg-success';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleChoiceAnswer(option)}
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

        {/* 철자 맞추기 모드 */}
        {gameMode === 'typing' && (
          <>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center space-y-6">
              <div className="text-9xl animate-bounce" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
                {question.emoji}
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-primary">💡 {question.hint}</p>
                <p className="text-3xl font-bold text-textDark">{question.korean}</p>
              </div>
              <p className="text-xl text-gray-600">
                이것을 <span className="font-bold text-secondary">영어</span>로?
              </p>
            </div>

            {!showAnswer && (
              <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="영어로 입력하세요"
                  className="w-full text-3xl font-bold text-center p-5 border-4 border-gray-300 rounded-xl focus:border-primary focus:outline-none"
                  autoFocus
                />
                <Button
                  variant="primary"
                  onClick={handleTypingSubmit}
                  fullWidth
                  disabled={!userAnswer.trim()}
                >
                  ✓ 확인
                </Button>
              </div>
            )}
          </>
        )}

        {/* 듣기 모드 */}
        {gameMode === 'listening' && (
          <>
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center space-y-6">
              <div className="text-9xl animate-bounce">👂</div>
              <div className="space-y-3">
                <div className="text-8xl" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
                  {question.emoji}
                </div>
                <p className="text-3xl font-bold text-textDark">{question.korean}</p>
                <p className="text-lg text-gray-600">💡 {question.hint}</p>
              </div>
              <p className="text-xl text-primary font-bold">
                영어로 무엇일까요?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {getListeningOptions().map((option, index) => {
                const isSelected = selectedChoice === option;
                const isAnswer = option === question.word;

                let bgColor = 'bg-white';
                if (showAnswer) {
                  if (isSelected && isCorrect) bgColor = 'bg-success';
                  else if (isSelected && !isCorrect) bgColor = 'bg-primary';
                  else if (isAnswer) bgColor = 'bg-success';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleListeningAnswer(option)}
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

        {/* 정답/오답 표시 */}
        {showAnswer && (
          <div className={`${isCorrect ? 'bg-success' : 'bg-primary'} rounded-2xl p-6 text-center text-white space-y-3 animate-bounce`}>
            <div className="text-5xl">{isCorrect ? '✓' : '✗'}</div>
            <div className="text-2xl font-bold">
              {isCorrect ? (
                streak >= 5 ? '🔥 대박! 연속 정답!' : '정답입니다!'
              ) : (
                '아쉬워요!'
              )}
            </div>
            {!isCorrect && (
              <div className="text-xl">
                정답: <span className="font-bold">{gameMode === 'listening' ? question.word : question.korean}</span>
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
