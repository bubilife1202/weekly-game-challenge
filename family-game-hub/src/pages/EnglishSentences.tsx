import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { soundManager } from '../utils/sound';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';

// 영어 문장 데이터
type Sentence = {
  sentence: string;
  korean: string;
  words: string[];
  blankIndex: number;
  blankOptions: string[];
  situation: string;
  emoji: string;
  category: string;
  level: number;
};

const allSentences: Sentence[] = [
  // 인사/감정 (Greetings & Feelings)
  { sentence: 'I am happy', korean: '나는 행복해요', words: ['I', 'am', 'happy'], blankIndex: 1, blankOptions: ['am', 'is', 'are', 'be'], situation: '😊 기분이 아주 좋아요!', emoji: '😊', category: 'greetings', level: 1 },
  { sentence: 'I am sad', korean: '나는 슬퍼요', words: ['I', 'am', 'sad'], blankIndex: 2, blankOptions: ['sad', 'happy', 'angry', 'tired'], situation: '😢 기분이 안 좋아요', emoji: '😢', category: 'greetings', level: 1 },
  { sentence: 'Hello my friend', korean: '안녕 내 친구', words: ['Hello', 'my', 'friend'], blankIndex: 0, blankOptions: ['Hello', 'Goodbye', 'Sorry', 'Thanks'], situation: '👋 친구를 만났어요', emoji: '👋', category: 'greetings', level: 1 },
  { sentence: 'Good morning mom', korean: '좋은 아침이에요 엄마', words: ['Good', 'morning', 'mom'], blankIndex: 1, blankOptions: ['morning', 'night', 'afternoon', 'evening'], situation: '🌅 아침에 일어났어요', emoji: '🌅', category: 'greetings', level: 1 },
  { sentence: 'Thank you very much', korean: '정말 고마워요', words: ['Thank', 'you', 'very', 'much'], blankIndex: 0, blankOptions: ['Thank', 'Sorry', 'Hello', 'Goodbye'], situation: '🙏 선물을 받았어요', emoji: '🙏', category: 'greetings', level: 1 },
  { sentence: 'I am sorry', korean: '미안해요', words: ['I', 'am', 'sorry'], blankIndex: 2, blankOptions: ['sorry', 'happy', 'good', 'fine'], situation: '😔 실수를 했어요', emoji: '😔', category: 'greetings', level: 1 },
  { sentence: 'How are you today', korean: '오늘 어떻게 지내요', words: ['How', 'are', 'you', 'today'], blankIndex: 1, blankOptions: ['are', 'is', 'am', 'be'], situation: '❓ 친구 기분을 물어봐요', emoji: '❓', category: 'greetings', level: 2 },
  { sentence: 'I feel great today', korean: '오늘 기분이 너무 좋아요', words: ['I', 'feel', 'great', 'today'], blankIndex: 2, blankOptions: ['great', 'bad', 'sad', 'sick'], situation: '🎉 기분 최고의 날!', emoji: '🎉', category: 'greetings', level: 2 },
  { sentence: 'Nice to meet you', korean: '만나서 반가워요', words: ['Nice', 'to', 'meet', 'you'], blankIndex: 2, blankOptions: ['meet', 'see', 'know', 'like'], situation: '🤝 새로운 친구를 만났어요', emoji: '🤝', category: 'greetings', level: 2 },
  { sentence: 'See you tomorrow', korean: '내일 봐요', words: ['See', 'you', 'tomorrow'], blankIndex: 2, blankOptions: ['tomorrow', 'today', 'yesterday', 'now'], situation: '👋 친구와 헤어져요', emoji: '👋', category: 'greetings', level: 2 },

  // 일상생활 (Daily Life)
  { sentence: 'I wake up early', korean: '나는 일찍 일어나요', words: ['I', 'wake', 'up', 'early'], blankIndex: 1, blankOptions: ['wake', 'get', 'stand', 'sit'], situation: '⏰ 아침 6시에 일어났어요', emoji: '⏰', category: 'daily', level: 1 },
  { sentence: 'I brush my teeth', korean: '나는 이를 닦아요', words: ['I', 'brush', 'my', 'teeth'], blankIndex: 3, blankOptions: ['teeth', 'hair', 'hands', 'face'], situation: '🪥 화장실에서 양치해요', emoji: '🪥', category: 'daily', level: 1 },
  { sentence: 'I eat breakfast', korean: '나는 아침을 먹어요', words: ['I', 'eat', 'breakfast'], blankIndex: 2, blankOptions: ['breakfast', 'lunch', 'dinner', 'snack'], situation: '🍳 아침 식사 시간이에요', emoji: '🍳', category: 'daily', level: 1 },
  { sentence: 'I go to bed', korean: '나는 잠자리에 들어요', words: ['I', 'go', 'to', 'bed'], blankIndex: 3, blankOptions: ['bed', 'school', 'park', 'home'], situation: '😴 밤 9시, 잘 시간이에요', emoji: '😴', category: 'daily', level: 1 },
  { sentence: 'I take a shower', korean: '나는 샤워해요', words: ['I', 'take', 'a', 'shower'], blankIndex: 1, blankOptions: ['take', 'make', 'do', 'get'], situation: '🚿 깨끗이 씻어요', emoji: '🚿', category: 'daily', level: 2 },
  { sentence: 'I watch TV at night', korean: '나는 밤에 TV를 봐요', words: ['I', 'watch', 'TV', 'at', 'night'], blankIndex: 1, blankOptions: ['watch', 'see', 'look', 'play'], situation: '📺 저녁에 TV를 봐요', emoji: '📺', category: 'daily', level: 2 },
  { sentence: 'I clean my room', korean: '나는 내 방을 청소해요', words: ['I', 'clean', 'my', 'room'], blankIndex: 1, blankOptions: ['clean', 'make', 'do', 'have'], situation: '🧹 방 정리 시간이에요', emoji: '🧹', category: 'daily', level: 2 },
  { sentence: 'I help my mom', korean: '나는 엄마를 도와요', words: ['I', 'help', 'my', 'mom'], blankIndex: 1, blankOptions: ['help', 'love', 'see', 'call'], situation: '👩 엄마 심부름해요', emoji: '👩', category: 'daily', level: 2 },
  { sentence: 'I do my homework every day', korean: '나는 매일 숙제를 해요', words: ['I', 'do', 'my', 'homework', 'every', 'day'], blankIndex: 1, blankOptions: ['do', 'make', 'take', 'get'], situation: '📝 집에서 숙제해요', emoji: '📝', category: 'daily', level: 3 },
  { sentence: 'I walk my dog in the park', korean: '나는 공원에서 강아지와 산책해요', words: ['I', 'walk', 'my', 'dog', 'in', 'the', 'park'], blankIndex: 1, blankOptions: ['walk', 'run', 'play', 'see'], situation: '🐕 강아지랑 산책해요', emoji: '🐕', category: 'daily', level: 3 },

  // 학교 (School)
  { sentence: 'I go to school', korean: '나는 학교에 가요', words: ['I', 'go', 'to', 'school'], blankIndex: 1, blankOptions: ['go', 'come', 'walk', 'run'], situation: '🏫 학교 가는 시간이에요', emoji: '🏫', category: 'school', level: 1 },
  { sentence: 'I study English', korean: '나는 영어를 공부해요', words: ['I', 'study', 'English'], blankIndex: 1, blankOptions: ['study', 'play', 'eat', 'sleep'], situation: '📚 영어 공부 시간이에요', emoji: '📚', category: 'school', level: 1 },
  { sentence: 'I like math class', korean: '나는 수학 수업이 좋아요', words: ['I', 'like', 'math', 'class'], blankIndex: 1, blankOptions: ['like', 'hate', 'know', 'see'], situation: '🔢 수학 시간이 재미있어요', emoji: '🔢', category: 'school', level: 1 },
  { sentence: 'I read a book', korean: '나는 책을 읽어요', words: ['I', 'read', 'a', 'book'], blankIndex: 1, blankOptions: ['read', 'write', 'make', 'buy'], situation: '📖 도서관에서 책 읽어요', emoji: '📖', category: 'school', level: 1 },
  { sentence: 'I write my name', korean: '나는 내 이름을 써요', words: ['I', 'write', 'my', 'name'], blankIndex: 1, blankOptions: ['write', 'read', 'say', 'know'], situation: '✏️ 공책에 이름 써요', emoji: '✏️', category: 'school', level: 1 },
  { sentence: 'I listen to my teacher', korean: '나는 선생님 말씀을 들어요', words: ['I', 'listen', 'to', 'my', 'teacher'], blankIndex: 1, blankOptions: ['listen', 'talk', 'speak', 'say'], situation: '👨‍🏫 선생님 수업 시간이에요', emoji: '👨‍🏫', category: 'school', level: 2 },
  { sentence: 'I play with my friends', korean: '나는 친구들과 놀아요', words: ['I', 'play', 'with', 'my', 'friends'], blankIndex: 1, blankOptions: ['play', 'study', 'eat', 'sleep'], situation: '👫 쉬는 시간이에요', emoji: '👫', category: 'school', level: 2 },
  { sentence: 'I eat lunch at school', korean: '나는 학교에서 점심을 먹어요', words: ['I', 'eat', 'lunch', 'at', 'school'], blankIndex: 1, blankOptions: ['eat', 'make', 'buy', 'cook'], situation: '🍱 급식 시간이에요', emoji: '🍱', category: 'school', level: 2 },
  { sentence: 'I draw a picture in art class', korean: '나는 미술 시간에 그림을 그려요', words: ['I', 'draw', 'a', 'picture', 'in', 'art', 'class'], blankIndex: 1, blankOptions: ['draw', 'paint', 'make', 'write'], situation: '🎨 미술 시간이에요', emoji: '🎨', category: 'school', level: 3 },
  { sentence: 'I raise my hand to answer', korean: '나는 대답하려고 손을 들어요', words: ['I', 'raise', 'my', 'hand', 'to', 'answer'], blankIndex: 1, blankOptions: ['raise', 'put', 'make', 'take'], situation: '✋ 질문에 답할게요', emoji: '✋', category: 'school', level: 3 },

  // 가족 (Family)
  { sentence: 'I love my family', korean: '나는 우리 가족을 사랑해요', words: ['I', 'love', 'my', 'family'], blankIndex: 1, blankOptions: ['love', 'like', 'see', 'know'], situation: '👨‍👩‍👧‍👦 가족이 최고예요', emoji: '👨‍👩‍👧‍👦', category: 'family', level: 1 },
  { sentence: 'This is my mom', korean: '이분은 우리 엄마예요', words: ['This', 'is', 'my', 'mom'], blankIndex: 1, blankOptions: ['is', 'am', 'are', 'be'], situation: '👩 엄마를 소개해요', emoji: '👩', category: 'family', level: 1 },
  { sentence: 'This is my dad', korean: '이분은 우리 아빠예요', words: ['This', 'is', 'my', 'dad'], blankIndex: 1, blankOptions: ['is', 'am', 'are', 'be'], situation: '👨 아빠를 소개해요', emoji: '👨', category: 'family', level: 1 },
  { sentence: 'I have a brother', korean: '나는 남동생이 있어요', words: ['I', 'have', 'a', 'brother'], blankIndex: 1, blankOptions: ['have', 'has', 'am', 'is'], situation: '👦 남동생이 있어요', emoji: '👦', category: 'family', level: 2 },
  { sentence: 'I have a sister', korean: '나는 여동생이 있어요', words: ['I', 'have', 'a', 'sister'], blankIndex: 1, blankOptions: ['have', 'has', 'am', 'is'], situation: '👧 여동생이 있어요', emoji: '👧', category: 'family', level: 2 },
  { sentence: 'My family is very happy', korean: '우리 가족은 아주 행복해요', words: ['My', 'family', 'is', 'very', 'happy'], blankIndex: 2, blankOptions: ['is', 'am', 'are', 'be'], situation: '😊 가족이 행복해요', emoji: '😊', category: 'family', level: 2 },
  { sentence: 'I play with my baby sister', korean: '나는 아기 여동생과 놀아요', words: ['I', 'play', 'with', 'my', 'baby', 'sister'], blankIndex: 1, blankOptions: ['play', 'talk', 'sleep', 'eat'], situation: '👶 아기와 놀아요', emoji: '👶', category: 'family', level: 3 },
  { sentence: 'My grandma tells me stories', korean: '할머니가 나에게 이야기를 들려줘요', words: ['My', 'grandma', 'tells', 'me', 'stories'], blankIndex: 2, blankOptions: ['tells', 'says', 'talks', 'speaks'], situation: '👵 할머니와 시간을 보내요', emoji: '👵', category: 'family', level: 3 },

  // 취미 (Hobbies)
  { sentence: 'I like soccer', korean: '나는 축구를 좋아해요', words: ['I', 'like', 'soccer'], blankIndex: 1, blankOptions: ['like', 'play', 'watch', 'know'], situation: '⚽ 축구가 재미있어요', emoji: '⚽', category: 'hobby', level: 1 },
  { sentence: 'I play the piano', korean: '나는 피아노를 쳐요', words: ['I', 'play', 'the', 'piano'], blankIndex: 1, blankOptions: ['play', 'make', 'do', 'like'], situation: '🎹 피아노 연습해요', emoji: '🎹', category: 'hobby', level: 1 },
  { sentence: 'I play computer games', korean: '나는 컴퓨터 게임을 해요', words: ['I', 'play', 'computer', 'games'], blankIndex: 1, blankOptions: ['play', 'watch', 'make', 'buy'], situation: '🎮 게임 시간이에요', emoji: '🎮', category: 'hobby', level: 1 },
  { sentence: 'I sing a song', korean: '나는 노래를 불러요', words: ['I', 'sing', 'a', 'song'], blankIndex: 1, blankOptions: ['sing', 'play', 'listen', 'write'], situation: '🎤 노래 불러요', emoji: '🎤', category: 'hobby', level: 1 },
  { sentence: 'I draw pictures every day', korean: '나는 매일 그림을 그려요', words: ['I', 'draw', 'pictures', 'every', 'day'], blankIndex: 1, blankOptions: ['draw', 'paint', 'make', 'write'], situation: '🖍️ 그림 그리기를 좋아해요', emoji: '🖍️', category: 'hobby', level: 2 },
  { sentence: 'I ride my bicycle', korean: '나는 자전거를 타요', words: ['I', 'ride', 'my', 'bicycle'], blankIndex: 1, blankOptions: ['ride', 'drive', 'play', 'run'], situation: '🚲 자전거 타요', emoji: '🚲', category: 'hobby', level: 2 },
  { sentence: 'I collect toy cars', korean: '나는 장난감 자동차를 수집해요', words: ['I', 'collect', 'toy', 'cars'], blankIndex: 1, blankOptions: ['collect', 'play', 'make', 'buy'], situation: '🚗 장난감 모아요', emoji: '🚗', category: 'hobby', level: 2 },
  { sentence: 'I love reading comic books', korean: '나는 만화책 읽기를 좋아해요', words: ['I', 'love', 'reading', 'comic', 'books'], blankIndex: 1, blankOptions: ['love', 'like', 'hate', 'know'], situation: '📚 만화책 읽어요', emoji: '📚', category: 'hobby', level: 3 },
  { sentence: 'I practice swimming every week', korean: '나는 매주 수영 연습을 해요', words: ['I', 'practice', 'swimming', 'every', 'week'], blankIndex: 1, blankOptions: ['practice', 'play', 'do', 'like'], situation: '🏊 수영장에서 연습해요', emoji: '🏊', category: 'hobby', level: 3 },

  // 음식 (Food)
  { sentence: 'I eat an apple', korean: '나는 사과를 먹어요', words: ['I', 'eat', 'an', 'apple'], blankIndex: 1, blankOptions: ['eat', 'like', 'buy', 'make'], situation: '🍎 사과를 먹어요', emoji: '🍎', category: 'food', level: 1 },
  { sentence: 'I drink water', korean: '나는 물을 마셔요', words: ['I', 'drink', 'water'], blankIndex: 1, blankOptions: ['drink', 'eat', 'make', 'buy'], situation: '💧 물을 마셔요', emoji: '💧', category: 'food', level: 1 },
  { sentence: 'I like pizza', korean: '나는 피자를 좋아해요', words: ['I', 'like', 'pizza'], blankIndex: 1, blankOptions: ['like', 'eat', 'make', 'buy'], situation: '🍕 피자가 맛있어요', emoji: '🍕', category: 'food', level: 1 },
  { sentence: 'I want some milk', korean: '나는 우유를 원해요', words: ['I', 'want', 'some', 'milk'], blankIndex: 1, blankOptions: ['want', 'drink', 'like', 'need'], situation: '🥛 우유 마시고 싶어요', emoji: '🥛', category: 'food', level: 2 },
  { sentence: 'I eat rice for dinner', korean: '나는 저녁에 밥을 먹어요', words: ['I', 'eat', 'rice', 'for', 'dinner'], blankIndex: 1, blankOptions: ['eat', 'make', 'cook', 'buy'], situation: '🍚 저녁 식사 시간이에요', emoji: '🍚', category: 'food', level: 2 },
  { sentence: 'I love chocolate cake', korean: '나는 초콜릿 케이크를 좋아해요', words: ['I', 'love', 'chocolate', 'cake'], blankIndex: 1, blankOptions: ['love', 'like', 'eat', 'make'], situation: '🎂 케이크가 최고예요', emoji: '🎂', category: 'food', level: 2 },
  { sentence: 'My favorite food is ice cream', korean: '내가 제일 좋아하는 음식은 아이스크림이에요', words: ['My', 'favorite', 'food', 'is', 'ice', 'cream'], blankIndex: 3, blankOptions: ['is', 'am', 'are', 'be'], situation: '🍦 아이스크림을 제일 좋아해요', emoji: '🍦', category: 'food', level: 3 },
  { sentence: 'I always eat vegetables', korean: '나는 항상 채소를 먹어요', words: ['I', 'always', 'eat', 'vegetables'], blankIndex: 2, blankOptions: ['eat', 'like', 'cook', 'buy'], situation: '🥦 건강한 음식을 먹어요', emoji: '🥦', category: 'food', level: 3 },
];

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

  // 순서 맞추기 모드
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);

  // 빈칸/선택 모드
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // 문제 생성
  useEffect(() => {
    if (selectedGrade && gameMode) {
      const sentences = sentencesByGrade[selectedGrade];
      const shuffled = [...sentences].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 15)); // 15문제
      setStartTime(Date.now());
    }
  }, [selectedGrade, gameMode]);

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
      setWrongSentences([...wrongSentences, sentence]);
    }

    setTimeout(() => {
      moveToNextQuestion(correct);
    }, 2500);
  };

  const handleFillBlankAnswer = (answer: string) => {
    if (selectedChoice) return;

    const sentence = questions[currentQuestion];
    const correct = answer === sentence.words[sentence.blankIndex];

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
      setWrongSentences([...wrongSentences, sentence]);
    }

    setTimeout(() => {
      moveToNextQuestion(correct);
    }, 2000);
  };

  const handleChooseAnswer = (answer: string) => {
    if (selectedChoice) return;

    const sentence = questions[currentQuestion];
    const correct = answer === sentence.sentence;

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
      setWrongSentences([...wrongSentences, sentence]);
    }

    setTimeout(() => {
      moveToNextQuestion(correct);
    }, 2000);
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
      setShowAnswer(false);
      setIsCorrect(false);
      setSelectedChoice(null);
      setOrderedWords([]);
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

  // 학년 선택 화면
  if (!selectedGrade) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="📖 영어 문장 만들기" showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">📝</div>
            <h2 className="text-2xl font-bold text-textDark">
              학년을 선택하세요
            </h2>
            <p className="text-gray-600">문장을 만들며 영어를 배워요!</p>
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
                      {sentencesByGrade[key as Grade].length}개 문장 수록
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

  const sentence = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background pb-20">
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

        {/* 순서 맞추기 모드 */}
        {gameMode === 'ordering' && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center space-y-4">
              <div className="text-7xl" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' }}>
                {sentence.emoji}
              </div>
              <p className="text-2xl font-bold text-textDark">{sentence.korean}</p>
              <p className="text-lg text-gray-600">단어를 눌러 순서대로 배열하세요!</p>
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
          <div className={`${isCorrect ? 'bg-success' : 'bg-primary'} rounded-2xl p-6 text-center text-white space-y-3 animate-bounce`}>
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
          </div>
        )}
      </div>
    </div>
  );
};
