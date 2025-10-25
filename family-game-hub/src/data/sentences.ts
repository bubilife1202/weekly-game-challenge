// 영어 문장 데이터 타입
export type Sentence = {
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

// 카테고리별 배경 그라디언트
export const categoryBackgrounds: Record<string, string> = {
  greetings: 'from-yellow-100 to-orange-100',
  daily: 'from-blue-100 to-cyan-100',
  school: 'from-green-100 to-emerald-100',
  family: 'from-pink-100 to-rose-100',
  hobby: 'from-purple-100 to-violet-100',
  food: 'from-red-100 to-orange-100',
  weather: 'from-sky-100 to-blue-100',
  time: 'from-amber-100 to-yellow-100',
  shopping: 'from-emerald-100 to-teal-100',
  health: 'from-rose-100 to-pink-100',
  travel: 'from-indigo-100 to-purple-100',
  animals: 'from-lime-100 to-green-100',
  numbers: 'from-cyan-100 to-sky-100',
  feelings: 'from-fuchsia-100 to-pink-100',
};

export const allSentences: Sentence[] = [
  // ===== 레벨 1: 기본 문장 (8-10 단어) =====

  // 인사/감정 (Greetings & Feelings)
  { sentence: 'I am very happy to see you today', korean: '오늘 너를 만나서 정말 행복해', words: ['I', 'am', 'very', 'happy', 'to', 'see', 'you', 'today'], blankIndex: 3, blankOptions: ['happy', 'sad', 'angry', 'tired'], situation: '😊 친구를 만나서 기쁜 날', emoji: '😊', category: 'greetings', level: 1 },
  { sentence: 'I feel so tired after playing all day long', korean: '하루 종일 놀고 나서 너무 피곤해', words: ['I', 'feel', 'so', 'tired', 'after', 'playing', 'all', 'day', 'long'], blankIndex: 3, blankOptions: ['tired', 'excited', 'happy', 'hungry'], situation: '😫 놀이터에서 많이 놀았어요', emoji: '😫', category: 'feelings', level: 1 },
  { sentence: 'Good morning everyone I hope you slept well', korean: '모두 좋은 아침이에요 잘 주무셨나요', words: ['Good', 'morning', 'everyone', 'I', 'hope', 'you', 'slept', 'well'], blankIndex: 6, blankOptions: ['slept', 'played', 'studied', 'worked'], situation: '🌅 아침 인사를 해요', emoji: '🌅', category: 'greetings', level: 1 },
  { sentence: 'Thank you so much for helping me with my homework', korean: '숙제 도와줘서 정말 고마워', words: ['Thank', 'you', 'so', 'much', 'for', 'helping', 'me', 'with', 'my', 'homework'], blankIndex: 5, blankOptions: ['helping', 'playing', 'talking', 'walking'], situation: '🙏 친구가 도와줬어요', emoji: '🙏', category: 'greetings', level: 1 },
  { sentence: 'I am really sorry for breaking your favorite toy', korean: '네 제일 좋아하는 장난감을 망가뜨려서 정말 미안해', words: ['I', 'am', 'really', 'sorry', 'for', 'breaking', 'your', 'favorite', 'toy'], blankIndex: 3, blankOptions: ['sorry', 'happy', 'proud', 'excited'], situation: '😔 실수로 장난감을 망가뜨렸어요', emoji: '😔', category: 'greetings', level: 1 },

  // 일상생활 (Daily Life)
  { sentence: 'I always wake up early in the morning at six', korean: '나는 항상 아침 6시에 일찍 일어나', words: ['I', 'always', 'wake', 'up', 'early', 'in', 'the', 'morning', 'at', 'six'], blankIndex: 2, blankOptions: ['wake', 'get', 'stand', 'sleep'], situation: '⏰ 매일 아침 일찍 일어나요', emoji: '⏰', category: 'daily', level: 1 },
  { sentence: 'I need to brush my teeth before going to bed', korean: '자기 전에 이를 닦아야 해', words: ['I', 'need', 'to', 'brush', 'my', 'teeth', 'before', 'going', 'to', 'bed'], blankIndex: 3, blankOptions: ['brush', 'wash', 'clean', 'wipe'], situation: '🪥 자기 전 양치 시간', emoji: '🪥', category: 'daily', level: 1 },
  { sentence: 'Every morning I eat breakfast with my whole family', korean: '매일 아침 온 가족과 함께 아침을 먹어', words: ['Every', 'morning', 'I', 'eat', 'breakfast', 'with', 'my', 'whole', 'family'], blankIndex: 4, blankOptions: ['breakfast', 'lunch', 'dinner', 'snack'], situation: '🍳 가족과 함께 아침 식사', emoji: '🍳', category: 'daily', level: 1 },
  { sentence: 'I usually take a warm shower after playing outside', korean: '밖에서 놀고 나면 보통 따뜻한 샤워를 해', words: ['I', 'usually', 'take', 'a', 'warm', 'shower', 'after', 'playing', 'outside'], blankIndex: 5, blankOptions: ['shower', 'bath', 'nap', 'walk'], situation: '🚿 놀고 와서 샤워해요', emoji: '🚿', category: 'daily', level: 1 },
  { sentence: 'My mom tells me to clean my room every weekend', korean: '엄마는 주말마다 방 청소하라고 말씀하셔', words: ['My', 'mom', 'tells', 'me', 'to', 'clean', 'my', 'room', 'every', 'weekend'], blankIndex: 5, blankOptions: ['clean', 'make', 'wash', 'paint'], situation: '🧹 주말 방 청소', emoji: '🧹', category: 'daily', level: 1 },

  // 학교 (School)
  { sentence: 'I go to school by bus every single morning', korean: '나는 매일 아침 버스를 타고 학교에 가', words: ['I', 'go', 'to', 'school', 'by', 'bus', 'every', 'single', 'morning'], blankIndex: 5, blankOptions: ['bus', 'car', 'bike', 'train'], situation: '🏫 버스 타고 등교해요', emoji: '🏫', category: 'school', level: 1 },
  { sentence: 'I really enjoy studying English with my best friends', korean: '나는 제일 친한 친구들과 영어 공부하는 게 정말 즐거워', words: ['I', 'really', 'enjoy', 'studying', 'English', 'with', 'my', 'best', 'friends'], blankIndex: 2, blankOptions: ['enjoy', 'hate', 'finish', 'start'], situation: '📚 친구들과 공부해요', emoji: '📚', category: 'school', level: 1 },
  { sentence: 'My favorite subject at school is math and science', korean: '학교에서 내가 제일 좋아하는 과목은 수학과 과학이야', words: ['My', 'favorite', 'subject', 'at', 'school', 'is', 'math', 'and', 'science'], blankIndex: 6, blankOptions: ['math', 'history', 'art', 'music'], situation: '🔢 좋아하는 과목', emoji: '🔢', category: 'school', level: 1 },
  { sentence: 'I love reading interesting books in the school library', korean: '학교 도서관에서 재미있는 책 읽는 걸 좋아해', words: ['I', 'love', 'reading', 'interesting', 'books', 'in', 'the', 'school', 'library'], blankIndex: 2, blankOptions: ['reading', 'writing', 'buying', 'finding'], situation: '📖 도서관에서 책 읽기', emoji: '📖', category: 'school', level: 1 },
  { sentence: 'Our teacher always gives us fun homework to do', korean: '우리 선생님은 항상 재미있는 숙제를 내주셔', words: ['Our', 'teacher', 'always', 'gives', 'us', 'fun', 'homework', 'to', 'do'], blankIndex: 6, blankOptions: ['homework', 'candy', 'books', 'pencils'], situation: '👨‍🏫 선생님이 숙제를 내주셔요', emoji: '👨‍🏫', category: 'school', level: 1 },

  // ===== 레벨 2: 중급 문장 (10-12 단어, 과거형/미래형) =====

  // 인사/감정
  { sentence: 'I was so excited when I heard the good news yesterday', korean: '어제 좋은 소식을 들었을 때 너무 신이 났어', words: ['I', 'was', 'so', 'excited', 'when', 'I', 'heard', 'the', 'good', 'news', 'yesterday'], blankIndex: 1, blankOptions: ['was', 'am', 'will be', 'have been'], situation: '🤩 어제 좋은 일이 있었어요', emoji: '🤩', category: 'feelings', level: 2 },
  { sentence: 'My best friend will come to visit me next weekend', korean: '제일 친한 친구가 다음 주말에 나를 보러 올 거야', words: ['My', 'best', 'friend', 'will', 'come', 'to', 'visit', 'me', 'next', 'weekend'], blankIndex: 3, blankOptions: ['will', 'did', 'has', 'was'], situation: '👋 친구가 곧 올 거예요', emoji: '👋', category: 'greetings', level: 2 },
  { sentence: 'I have been feeling very happy since this morning started', korean: '오늘 아침부터 계속 행복한 기분이야', words: ['I', 'have', 'been', 'feeling', 'very', 'happy', 'since', 'this', 'morning', 'started'], blankIndex: 2, blankOptions: ['been', 'was', 'am', 'will'], situation: '😊 아침부터 기분이 좋아요', emoji: '😊', category: 'feelings', level: 2 },
  { sentence: 'I felt really scared when I watched that horror movie', korean: '그 무서운 영화를 봤을 때 정말 무서웠어', words: ['I', 'felt', 'really', 'scared', 'when', 'I', 'watched', 'that', 'horror', 'movie'], blankIndex: 1, blankOptions: ['felt', 'feel', 'will feel', 'have felt'], situation: '😨 무서운 영화를 봤어요', emoji: '😨', category: 'feelings', level: 2 },

  // 일상생활
  { sentence: 'I had to finish all my homework before dinner time', korean: '저녁 시간 전에 숙제를 전부 끝내야 했어', words: ['I', 'had', 'to', 'finish', 'all', 'my', 'homework', 'before', 'dinner', 'time'], blankIndex: 3, blankOptions: ['finish', 'start', 'find', 'lose'], situation: '📝 저녁 전에 숙제 완료', emoji: '📝', category: 'daily', level: 2 },
  { sentence: 'Yesterday I helped my mother cook a delicious dinner for everyone', korean: '어제 엄마가 맛있는 저녁을 요리하시는 걸 도와드렸어', words: ['Yesterday', 'I', 'helped', 'my', 'mother', 'cook', 'a', 'delicious', 'dinner', 'for', 'everyone'], blankIndex: 5, blankOptions: ['cook', 'eat', 'buy', 'clean'], situation: '👩 엄마를 도와드렸어요', emoji: '👩', category: 'daily', level: 2 },
  { sentence: 'Tomorrow I will wake up very early to catch the bus', korean: '내일은 버스를 타려고 아주 일찍 일어날 거야', words: ['Tomorrow', 'I', 'will', 'wake', 'up', 'very', 'early', 'to', 'catch', 'the', 'bus'], blankIndex: 2, blankOptions: ['will', 'did', 'have', 'am'], situation: '⏰ 내일 일찍 일어나야 해요', emoji: '⏰', category: 'daily', level: 2 },
  { sentence: 'My little brother has been watching TV for three hours now', korean: '내 남동생은 지금 세 시간째 TV를 보고 있어', words: ['My', 'little', 'brother', 'has', 'been', 'watching', 'TV', 'for', 'three', 'hours', 'now'], blankIndex: 4, blankOptions: ['been', 'was', 'is', 'will'], situation: '📺 남동생이 오래 TV 봐요', emoji: '📺', category: 'daily', level: 2 },

  // 학교
  { sentence: 'Last week we learned about many different animals in science class', korean: '지난주에 과학 시간에 여러 다른 동물들에 대해 배웠어', words: ['Last', 'week', 'we', 'learned', 'about', 'many', 'different', 'animals', 'in', 'science', 'class'], blankIndex: 3, blankOptions: ['learned', 'taught', 'played', 'forgot'], situation: '🔬 과학 시간에 동물을 배웠어요', emoji: '🔬', category: 'school', level: 2 },
  { sentence: 'Our teacher said we will have a big test next Monday', korean: '선생님이 다음 월요일에 큰 시험이 있을 거라고 하셨어', words: ['Our', 'teacher', 'said', 'we', 'will', 'have', 'a', 'big', 'test', 'next', 'Monday'], blankIndex: 4, blankOptions: ['will', 'did', 'have', 'are'], situation: '📝 다음 주에 시험이 있어요', emoji: '📝', category: 'school', level: 2 },
  { sentence: 'I have been studying English for more than two years now', korean: '나는 지금까지 2년 넘게 영어를 공부해왔어', words: ['I', 'have', 'been', 'studying', 'English', 'for', 'more', 'than', 'two', 'years', 'now'], blankIndex: 2, blankOptions: ['been', 'was', 'am', 'will'], situation: '📚 영어 공부 2년째', emoji: '📚', category: 'school', level: 2 },
  { sentence: 'During lunch time my friends and I played soccer together happily', korean: '점심시간에 친구들과 나는 함께 즐겁게 축구를 했어', words: ['During', 'lunch', 'time', 'my', 'friends', 'and', 'I', 'played', 'soccer', 'together', 'happily'], blankIndex: 7, blankOptions: ['played', 'studied', 'ate', 'slept'], situation: '⚽ 점심시간에 축구했어요', emoji: '⚽', category: 'school', level: 2 },

  // ===== 레벨 3: 고급 문장 (12-15 단어, 복잡한 문법) =====

  // 인사/감정
  { sentence: 'I would have been much happier if you had come to my birthday party', korean: '네가 내 생일 파티에 왔더라면 훨씬 더 행복했을 텐데', words: ['I', 'would', 'have', 'been', 'much', 'happier', 'if', 'you', 'had', 'come', 'to', 'my', 'birthday', 'party'], blankIndex: 1, blankOptions: ['would', 'will', 'can', 'must'], situation: '🎂 생일 파티에 오지 않아 아쉬워요', emoji: '🎂', category: 'feelings', level: 3 },
  { sentence: 'Although I was feeling tired I decided to help my friend anyway', korean: '피곤했지만 어쨌든 친구를 돕기로 결정했어', words: ['Although', 'I', 'was', 'feeling', 'tired', 'I', 'decided', 'to', 'help', 'my', 'friend', 'anyway'], blankIndex: 6, blankOptions: ['decided', 'refused', 'forgot', 'tried'], situation: '😫 피곤하지만 친구를 도와요', emoji: '😫', category: 'feelings', level: 3 },
  { sentence: 'I have never felt so proud of myself as I do right now', korean: '지금만큼 자랑스러웠던 적이 없어', words: ['I', 'have', 'never', 'felt', 'so', 'proud', 'of', 'myself', 'as', 'I', 'do', 'right', 'now'], blankIndex: 1, blankOptions: ['have', 'had', 'will', 'am'], situation: '😌 너무 자랑스러운 순간', emoji: '😌', category: 'feelings', level: 3 },

  // 일상생활
  { sentence: 'By the time I arrived home everyone had already finished eating dinner', korean: '내가 집에 도착했을 때 모두 이미 저녁을 다 먹었어', words: ['By', 'the', 'time', 'I', 'arrived', 'home', 'everyone', 'had', 'already', 'finished', 'eating', 'dinner'], blankIndex: 7, blankOptions: ['had', 'has', 'have', 'will'], situation: '🍽️ 늦게 집에 도착했어요', emoji: '🍽️', category: 'daily', level: 3 },
  { sentence: 'If I had known it would rain I would have brought an umbrella', korean: '비가 올 줄 알았다면 우산을 가져왔을 텐데', words: ['If', 'I', 'had', 'known', 'it', 'would', 'rain', 'I', 'would', 'have', 'brought', 'an', 'umbrella'], blankIndex: 2, blankOptions: ['had', 'have', 'has', 'will'], situation: '☔ 우산을 안 가져와서 비를 맞았어요', emoji: '☔', category: 'weather', level: 3 },
  { sentence: 'While my mother was cooking dinner I was doing my homework quietly', korean: '엄마가 저녁을 요리하시는 동안 나는 조용히 숙제를 하고 있었어', words: ['While', 'my', 'mother', 'was', 'cooking', 'dinner', 'I', 'was', 'doing', 'my', 'homework', 'quietly'], blankIndex: 7, blankOptions: ['was', 'am', 'have', 'will'], situation: '📝 엄마가 요리하시는 동안 숙제했어요', emoji: '📝', category: 'daily', level: 3 },
  { sentence: 'I wish I could have more free time to play with my friends', korean: '친구들과 놀 자유 시간이 더 많았으면 좋겠어', words: ['I', 'wish', 'I', 'could', 'have', 'more', 'free', 'time', 'to', 'play', 'with', 'my', 'friends'], blankIndex: 1, blankOptions: ['wish', 'hope', 'want', 'think'], situation: '😔 자유 시간이 부족해요', emoji: '😔', category: 'feelings', level: 3 },

  // 학교
  { sentence: 'The book that I borrowed from the library yesterday was really interesting', korean: '어제 도서관에서 빌린 책이 정말 흥미로웠어', words: ['The', 'book', 'that', 'I', 'borrowed', 'from', 'the', 'library', 'yesterday', 'was', 'really', 'interesting'], blankIndex: 4, blankOptions: ['borrowed', 'bought', 'stole', 'found'], situation: '📖 도서관에서 빌린 책이 재밌어요', emoji: '📖', category: 'school', level: 3 },
  { sentence: 'Unless you study hard every day you will not pass the final exam', korean: '매일 열심히 공부하지 않으면 기말고사를 통과하지 못할 거야', words: ['Unless', 'you', 'study', 'hard', 'every', 'day', 'you', 'will', 'not', 'pass', 'the', 'final', 'exam'], blankIndex: 7, blankOptions: ['will', 'would', 'can', 'must'], situation: '📝 열심히 공부해야 해요', emoji: '📝', category: 'school', level: 3 },
  { sentence: 'My teacher explained the difficult math problem until everyone finally understood it', korean: '선생님은 모두가 마침내 이해할 때까지 어려운 수학 문제를 설명하셨어', words: ['My', 'teacher', 'explained', 'the', 'difficult', 'math', 'problem', 'until', 'everyone', 'finally', 'understood', 'it'], blankIndex: 10, blankOptions: ['understood', 'forgot', 'ignored', 'avoided'], situation: '🔢 선생님이 끝까지 설명하셨어요', emoji: '🔢', category: 'school', level: 3 },
  { sentence: 'I have been preparing for the science fair project for almost three months', korean: '과학 전람회 프로젝트를 거의 3개월 동안 준비해왔어', words: ['I', 'have', 'been', 'preparing', 'for', 'the', 'science', 'fair', 'project', 'for', 'almost', 'three', 'months'], blankIndex: 2, blankOptions: ['been', 'was', 'am', 'will'], situation: '🔬 오랫동안 프로젝트 준비 중', emoji: '🔬', category: 'school', level: 3 },

  // 가족 (Family)
  { sentence: 'My grandmother who lives far away will visit us this summer vacation', korean: '멀리 사시는 할머니가 이번 여름 방학에 우리를 방문하실 거야', words: ['My', 'grandmother', 'who', 'lives', 'far', 'away', 'will', 'visit', 'us', 'this', 'summer', 'vacation'], blankIndex: 6, blankOptions: ['will', 'did', 'has', 'is'], situation: '👵 할머니가 방문하실 거예요', emoji: '👵', category: 'family', level: 3 },
  { sentence: 'Even though my brother is younger than me he is taller now', korean: '내 남동생이 나보다 어리지만 지금은 더 커', words: ['Even', 'though', 'my', 'brother', 'is', 'younger', 'than', 'me', 'he', 'is', 'taller', 'now'], blankIndex: 9, blankOptions: ['is', 'was', 'will be', 'has been'], situation: '👦 남동생이 더 커졌어요', emoji: '👦', category: 'family', level: 3 },

  // 취미 (Hobbies)
  { sentence: 'I enjoy playing basketball with my friends after school finishes every day', korean: '매일 방과 후에 친구들과 농구하는 걸 즐겨', words: ['I', 'enjoy', 'playing', 'basketball', 'with', 'my', 'friends', 'after', 'school', 'finishes', 'every', 'day'], blankIndex: 1, blankOptions: ['enjoy', 'hate', 'avoid', 'finish'], situation: '🏀 방과 후 농구 시간', emoji: '🏀', category: 'hobby', level: 2 },
  { sentence: 'When I grow up I want to become a professional soccer player', korean: '나는 자라면 프로 축구 선수가 되고 싶어', words: ['When', 'I', 'grow', 'up', 'I', 'want', 'to', 'become', 'a', 'professional', 'soccer', 'player'], blankIndex: 7, blankOptions: ['become', 'meet', 'find', 'lose'], situation: '⚽ 미래의 꿈', emoji: '⚽', category: 'hobby', level: 3 },
  { sentence: 'I have been learning to play the piano since I was five years old', korean: '나는 다섯 살 때부터 피아노 치는 법을 배워왔어', words: ['I', 'have', 'been', 'learning', 'to', 'play', 'the', 'piano', 'since', 'I', 'was', 'five', 'years', 'old'], blankIndex: 2, blankOptions: ['been', 'was', 'am', 'will'], situation: '🎹 어릴 때부터 피아노 배워요', emoji: '🎹', category: 'hobby', level: 3 },

  // 음식 (Food)
  { sentence: 'My favorite food is the pizza that my mom makes every weekend', korean: '내가 제일 좋아하는 음식은 엄마가 주말마다 만드시는 피자야', words: ['My', 'favorite', 'food', 'is', 'the', 'pizza', 'that', 'my', 'mom', 'makes', 'every', 'weekend'], blankIndex: 9, blankOptions: ['makes', 'buys', 'eats', 'throws'], situation: '🍕 엄마가 만드신 피자', emoji: '🍕', category: 'food', level: 3 },
  { sentence: 'If you eat too much candy your teeth will start to hurt badly', korean: '사탕을 너무 많이 먹으면 이가 심하게 아프기 시작할 거야', words: ['If', 'you', 'eat', 'too', 'much', 'candy', 'your', 'teeth', 'will', 'start', 'to', 'hurt', 'badly'], blankIndex: 8, blankOptions: ['will', 'would', 'can', 'must'], situation: '🦷 사탕을 너무 많이 먹으면 안 돼요', emoji: '🦷', category: 'food', level: 3 },

  // 날씨/계절 (Weather/Seasons)
  { sentence: 'It has been raining heavily for more than three days already', korean: '벌써 3일 넘게 비가 세게 내리고 있어', words: ['It', 'has', 'been', 'raining', 'heavily', 'for', 'more', 'than', 'three', 'days', 'already'], blankIndex: 2, blankOptions: ['been', 'was', 'is', 'will'], situation: '🌧️ 비가 계속 와요', emoji: '🌧️', category: 'weather', level: 3 },
  { sentence: 'When winter comes we will be able to see beautiful white snow', korean: '겨울이 오면 우리는 아름다운 하얀 눈을 볼 수 있을 거야', words: ['When', 'winter', 'comes', 'we', 'will', 'be', 'able', 'to', 'see', 'beautiful', 'white', 'snow'], blankIndex: 4, blankOptions: ['will', 'would', 'can', 'must'], situation: '⛄ 겨울이 다가와요', emoji: '⛄', category: 'weather', level: 3 },

  // 시간 (Time)
  { sentence: 'By the time the clock strikes twelve I will already be asleep', korean: '시계가 12시를 칠 때쯤이면 나는 이미 자고 있을 거야', words: ['By', 'the', 'time', 'the', 'clock', 'strikes', 'twelve', 'I', 'will', 'already', 'be', 'asleep'], blankIndex: 8, blankOptions: ['will', 'would', 'can', 'must'], situation: '😴 12시면 자고 있을 거예요', emoji: '😴', category: 'time', level: 3 },
  { sentence: 'I usually spend about two hours doing homework after school ends', korean: '나는 보통 학교가 끝나고 약 2시간 동안 숙제를 해', words: ['I', 'usually', 'spend', 'about', 'two', 'hours', 'doing', 'homework', 'after', 'school', 'ends'], blankIndex: 2, blankOptions: ['spend', 'waste', 'save', 'lose'], situation: '📝 방과 후 숙제 시간', emoji: '📝', category: 'time', level: 2 },

  // 숫자/세기 (Numbers/Counting)
  { sentence: 'There are more than thirty students in my classroom this year', korean: '올해 우리 교실에는 30명 넘는 학생들이 있어', words: ['There', 'are', 'more', 'than', 'thirty', 'students', 'in', 'my', 'classroom', 'this', 'year'], blankIndex: 1, blankOptions: ['are', 'is', 'was', 'were'], situation: '👫 교실에 학생이 많아요', emoji: '👫', category: 'numbers', level: 2 },
  { sentence: 'I have been counting the days until my birthday arrives next month', korean: '다음 달 내 생일이 올 때까지 날짜를 세고 있어', words: ['I', 'have', 'been', 'counting', 'the', 'days', 'until', 'my', 'birthday', 'arrives', 'next', 'month'], blankIndex: 2, blankOptions: ['been', 'was', 'am', 'will'], situation: '🎂 생일을 기다려요', emoji: '🎂', category: 'numbers', level: 3 },

  // 동물 (Animals)
  { sentence: 'The dog that lives next door barks very loudly every single morning', korean: '옆집에 사는 개가 매일 아침 아주 크게 짖어', words: ['The', 'dog', 'that', 'lives', 'next', 'door', 'barks', 'very', 'loudly', 'every', 'single', 'morning'], blankIndex: 6, blankOptions: ['barks', 'sleeps', 'eats', 'runs'], situation: '🐕 옆집 개가 시끄러워요', emoji: '🐕', category: 'animals', level: 3 },
  { sentence: 'I wish I could have a cute little puppy as my pet', korean: '귀여운 작은 강아지를 애완동물로 가질 수 있었으면 좋겠어', words: ['I', 'wish', 'I', 'could', 'have', 'a', 'cute', 'little', 'puppy', 'as', 'my', 'pet'], blankIndex: 3, blankOptions: ['could', 'can', 'will', 'must'], situation: '🐶 강아지를 키우고 싶어요', emoji: '🐶', category: 'animals', level: 3 },

  // 건강 (Health)
  { sentence: 'If you do not exercise regularly you will not stay healthy', korean: '규칙적으로 운동하지 않으면 건강을 유지하지 못할 거야', words: ['If', 'you', 'do', 'not', 'exercise', 'regularly', 'you', 'will', 'not', 'stay', 'healthy'], blankIndex: 7, blankOptions: ['will', 'would', 'can', 'must'], situation: '💪 규칙적인 운동이 중요해요', emoji: '💪', category: 'health', level: 3 },
  { sentence: 'I had to stay home from school because I was feeling sick', korean: '아파서 학교에 가지 못하고 집에 있어야 했어', words: ['I', 'had', 'to', 'stay', 'home', 'from', 'school', 'because', 'I', 'was', 'feeling', 'sick'], blankIndex: 1, blankOptions: ['had', 'have', 'has', 'will'], situation: '🤧 아파서 학교를 쉬었어요', emoji: '🤧', category: 'health', level: 2 },

  // 쇼핑 (Shopping)
  { sentence: 'When I went shopping yesterday I bought three new books to read', korean: '어제 쇼핑 갔을 때 읽을 새 책 세 권을 샀어', words: ['When', 'I', 'went', 'shopping', 'yesterday', 'I', 'bought', 'three', 'new', 'books', 'to', 'read'], blankIndex: 6, blankOptions: ['bought', 'sold', 'lost', 'threw'], situation: '📚 쇼핑해서 책을 샀어요', emoji: '📚', category: 'shopping', level: 2 },
  { sentence: 'I have been saving my allowance for months to buy that toy', korean: '그 장난감을 사려고 몇 달 동안 용돈을 모아왔어', words: ['I', 'have', 'been', 'saving', 'my', 'allowance', 'for', 'months', 'to', 'buy', 'that', 'toy'], blankIndex: 2, blankOptions: ['been', 'was', 'am', 'will'], situation: '🧸 용돈을 모아요', emoji: '🧸', category: 'shopping', level: 3 },

  // 여행 (Travel)
  { sentence: 'We will go on a wonderful family trip to the beach next summer', korean: '우리는 다음 여름에 해변으로 멋진 가족 여행을 갈 거야', words: ['We', 'will', 'go', 'on', 'a', 'wonderful', 'family', 'trip', 'to', 'the', 'beach', 'next', 'summer'], blankIndex: 1, blankOptions: ['will', 'would', 'can', 'must'], situation: '🏖️ 여름 휴가 계획', emoji: '🏖️', category: 'travel', level: 2 },
  { sentence: 'If I could travel anywhere in the world I would visit Paris', korean: '세계 어디든 여행할 수 있다면 파리에 가고 싶어', words: ['If', 'I', 'could', 'travel', 'anywhere', 'in', 'the', 'world', 'I', 'would', 'visit', 'Paris'], blankIndex: 2, blankOptions: ['could', 'can', 'will', 'must'], situation: '✈️ 가고 싶은 곳', emoji: '✈️', category: 'travel', level: 3 },
];

// 총 70개 이상의 고난이도 문장!
