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
  // ===== 인사/감정 (Greetings & Feelings) =====
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
  { sentence: 'Good night sweet dreams', korean: '좋은 밤 되세요', words: ['Good', 'night', 'sweet', 'dreams'], blankIndex: 1, blankOptions: ['night', 'morning', 'day', 'afternoon'], situation: '🌙 잘 자요', emoji: '🌙', category: 'greetings', level: 2 },
  { sentence: 'Have a nice day', korean: '좋은 하루 보내세요', words: ['Have', 'a', 'nice', 'day'], blankIndex: 2, blankOptions: ['nice', 'bad', 'long', 'short'], situation: '☀️ 아침 인사해요', emoji: '☀️', category: 'greetings', level: 2 },
  { sentence: 'I miss you so much', korean: '너무 보고 싶어요', words: ['I', 'miss', 'you', 'so', 'much'], blankIndex: 1, blankOptions: ['miss', 'love', 'like', 'see'], situation: '💕 멀리 있는 친구 생각해요', emoji: '💕', category: 'greetings', level: 3 },
  { sentence: 'Congratulations on your birthday', korean: '생일 축하해요', words: ['Congratulations', 'on', 'your', 'birthday'], blankIndex: 3, blankOptions: ['birthday', 'holiday', 'party', 'cake'], situation: '🎂 친구 생일이에요', emoji: '🎂', category: 'greetings', level: 3 },

  // ===== 일상생활 (Daily Life) =====
  { sentence: 'I wake up early', korean: '나는 일찍 일어나요', words: ['I', 'wake', 'up', 'early'], blankIndex: 1, blankOptions: ['wake', 'get', 'stand', 'sit'], situation: '⏰ 아침 6시에 일어났어요', emoji: '⏰', category: 'daily', level: 1 },
  { sentence: 'I brush my teeth', korean: '나는 이를 닦아요', words: ['I', 'brush', 'my', 'teeth'], blankIndex: 3, blankOptions: ['teeth', 'hair', 'hands', 'face'], situation: '🪥 화장실에서 양치해요', emoji: '🪥', category: 'daily', level: 1 },
  { sentence: 'I eat breakfast', korean: '나는 아침을 먹어요', words: ['I', 'eat', 'breakfast'], blankIndex: 2, blankOptions: ['breakfast', 'lunch', 'dinner', 'snack'], situation: '🍳 아침 식사 시간이에요', emoji: '🍳', category: 'daily', level: 1 },
  { sentence: 'I go to bed', korean: '나는 잠자리에 들어요', words: ['I', 'go', 'to', 'bed'], blankIndex: 3, blankOptions: ['bed', 'school', 'park', 'home'], situation: '😴 밤 9시, 잘 시간이에요', emoji: '😴', category: 'daily', level: 1 },
  { sentence: 'I take a shower', korean: '나는 샤워해요', words: ['I', 'take', 'a', 'shower'], blankIndex: 1, blankOptions: ['take', 'make', 'do', 'get'], situation: '🚿 깨끗이 씻어요', emoji: '🚿', category: 'daily', level: 2 },
  { sentence: 'I watch TV at night', korean: '나는 밤에 TV를 봐요', words: ['I', 'watch', 'TV', 'at', 'night'], blankIndex: 1, blankOptions: ['watch', 'see', 'look', 'play'], situation: '📺 저녁에 TV를 봐요', emoji: '📺', category: 'daily', level: 2 },
  { sentence: 'I clean my room', korean: '나는 내 방을 청소해요', words: ['I', 'clean', 'my', 'room'], blankIndex: 1, blankOptions: ['clean', 'make', 'do', 'have'], situation: '🧹 방 정리 시간이에요', emoji: '🧹', category: 'daily', level: 2 },
  { sentence: 'I help my mom', korean: '나는 엄마를 도와요', words: ['I', 'help', 'my', 'mom'], blankIndex: 1, blankOptions: ['help', 'love', 'see', 'call'], situation: '👩 엄마 심부름해요', emoji: '👩', category: 'daily', level: 2 },
  { sentence: 'I wash my hands', korean: '나는 손을 씻어요', words: ['I', 'wash', 'my', 'hands'], blankIndex: 1, blankOptions: ['wash', 'clean', 'dry', 'wipe'], situation: '🧼 손 씻기', emoji: '🧼', category: 'daily', level: 1 },
  { sentence: 'I drink water', korean: '나는 물을 마셔요', words: ['I', 'drink', 'water'], blankIndex: 1, blankOptions: ['drink', 'eat', 'like', 'want'], situation: '💧 목이 말라요', emoji: '💧', category: 'daily', level: 1 },
  { sentence: 'I get dressed', korean: '나는 옷을 입어요', words: ['I', 'get', 'dressed'], blankIndex: 1, blankOptions: ['get', 'put', 'wear', 'take'], situation: '👕 옷 입기', emoji: '👕', category: 'daily', level: 2 },
  { sentence: 'I make my bed', korean: '나는 침대를 정리해요', words: ['I', 'make', 'my', 'bed'], blankIndex: 1, blankOptions: ['make', 'clean', 'wash', 'do'], situation: '🛏️ 아침에 침대 정리', emoji: '🛏️', category: 'daily', level: 2 },
  { sentence: 'I do my homework every day', korean: '나는 매일 숙제를 해요', words: ['I', 'do', 'my', 'homework', 'every', 'day'], blankIndex: 1, blankOptions: ['do', 'make', 'take', 'get'], situation: '📝 집에서 숙제해요', emoji: '📝', category: 'daily', level: 3 },
  { sentence: 'I walk my dog in the park', korean: '나는 공원에서 강아지와 산책해요', words: ['I', 'walk', 'my', 'dog', 'in', 'the', 'park'], blankIndex: 1, blankOptions: ['walk', 'run', 'play', 'see'], situation: '🐕 강아지랑 산책해요', emoji: '🐕', category: 'daily', level: 3 },
  { sentence: 'I set the table for dinner', korean: '나는 저녁 식탁을 준비해요', words: ['I', 'set', 'the', 'table', 'for', 'dinner'], blankIndex: 1, blankOptions: ['set', 'make', 'clean', 'put'], situation: '🍽️ 저녁 준비해요', emoji: '🍽️', category: 'daily', level: 3 },

  // ===== 학교 (School) =====
  { sentence: 'I go to school', korean: '나는 학교에 가요', words: ['I', 'go', 'to', 'school'], blankIndex: 1, blankOptions: ['go', 'come', 'walk', 'run'], situation: '🏫 학교 가는 시간이에요', emoji: '🏫', category: 'school', level: 1 },
  { sentence: 'I study English', korean: '나는 영어를 공부해요', words: ['I', 'study', 'English'], blankIndex: 1, blankOptions: ['study', 'play', 'eat', 'sleep'], situation: '📚 영어 공부 시간이에요', emoji: '📚', category: 'school', level: 1 },
  { sentence: 'I like math class', korean: '나는 수학 수업이 좋아요', words: ['I', 'like', 'math', 'class'], blankIndex: 1, blankOptions: ['like', 'hate', 'know', 'see'], situation: '🔢 수학 시간이 재미있어요', emoji: '🔢', category: 'school', level: 1 },
  { sentence: 'I read a book', korean: '나는 책을 읽어요', words: ['I', 'read', 'a', 'book'], blankIndex: 1, blankOptions: ['read', 'write', 'make', 'buy'], situation: '📖 도서관에서 책 읽어요', emoji: '📖', category: 'school', level: 1 },
  { sentence: 'I write my name', korean: '나는 내 이름을 써요', words: ['I', 'write', 'my', 'name'], blankIndex: 1, blankOptions: ['write', 'read', 'say', 'know'], situation: '✏️ 공책에 이름 써요', emoji: '✏️', category: 'school', level: 1 },
  { sentence: 'I listen to my teacher', korean: '나는 선생님 말씀을 들어요', words: ['I', 'listen', 'to', 'my', 'teacher'], blankIndex: 1, blankOptions: ['listen', 'talk', 'speak', 'say'], situation: '👨‍🏫 선생님 수업 시간이에요', emoji: '👨‍🏫', category: 'school', level: 2 },
  { sentence: 'I play with my friends', korean: '나는 친구들과 놀아요', words: ['I', 'play', 'with', 'my', 'friends'], blankIndex: 1, blankOptions: ['play', 'study', 'eat', 'sleep'], situation: '👫 쉬는 시간이에요', emoji: '👫', category: 'school', level: 2 },
  { sentence: 'I eat lunch at school', korean: '나는 학교에서 점심을 먹어요', words: ['I', 'eat', 'lunch', 'at', 'school'], blankIndex: 1, blankOptions: ['eat', 'make', 'buy', 'cook'], situation: '🍱 급식 시간이에요', emoji: '🍱', category: 'school', level: 2 },
  { sentence: 'I raise my hand to answer', korean: '나는 대답하려고 손을 들어요', words: ['I', 'raise', 'my', 'hand', 'to', 'answer'], blankIndex: 1, blankOptions: ['raise', 'put', 'make', 'take'], situation: '✋ 질문에 답할게요', emoji: '✋', category: 'school', level: 3 },
  { sentence: 'I draw a picture in art class', korean: '나는 미술 시간에 그림을 그려요', words: ['I', 'draw', 'a', 'picture', 'in', 'art', 'class'], blankIndex: 1, blankOptions: ['draw', 'paint', 'make', 'write'], situation: '🎨 미술 시간이에요', emoji: '🎨', category: 'school', level: 3 },
  { sentence: 'I practice piano after school', korean: '나는 방과 후 피아노 연습해요', words: ['I', 'practice', 'piano', 'after', 'school'], blankIndex: 1, blankOptions: ['practice', 'play', 'learn', 'study'], situation: '🎹 방과후 활동', emoji: '🎹', category: 'school', level: 3 },
  { sentence: 'I take the school bus', korean: '나는 스쿨버스를 타요', words: ['I', 'take', 'the', 'school', 'bus'], blankIndex: 1, blankOptions: ['take', 'ride', 'drive', 'catch'], situation: '🚌 버스 타고 학교 가요', emoji: '🚌', category: 'school', level: 2 },

  // ===== 가족 (Family) =====
  { sentence: 'I love my family', korean: '나는 우리 가족을 사랑해요', words: ['I', 'love', 'my', 'family'], blankIndex: 1, blankOptions: ['love', 'like', 'see', 'know'], situation: '👨‍👩‍👧‍👦 가족이 최고예요', emoji: '👨‍👩‍👧‍👦', category: 'family', level: 1 },
  { sentence: 'This is my mom', korean: '이분은 우리 엄마예요', words: ['This', 'is', 'my', 'mom'], blankIndex: 1, blankOptions: ['is', 'am', 'are', 'be'], situation: '👩 엄마를 소개해요', emoji: '👩', category: 'family', level: 1 },
  { sentence: 'This is my dad', korean: '이분은 우리 아빠예요', words: ['This', 'is', 'my', 'dad'], blankIndex: 1, blankOptions: ['is', 'am', 'are', 'be'], situation: '👨 아빠를 소개해요', emoji: '👨', category: 'family', level: 1 },
  { sentence: 'I have a brother', korean: '나는 남동생이 있어요', words: ['I', 'have', 'a', 'brother'], blankIndex: 1, blankOptions: ['have', 'has', 'am', 'is'], situation: '👦 남동생이 있어요', emoji: '👦', category: 'family', level: 2 },
  { sentence: 'I have a sister', korean: '나는 여동생이 있어요', words: ['I', 'have', 'a', 'sister'], blankIndex: 1, blankOptions: ['have', 'has', 'am', 'is'], situation: '👧 여동생이 있어요', emoji: '👧', category: 'family', level: 2 },
  { sentence: 'My family is very happy', korean: '우리 가족은 아주 행복해요', words: ['My', 'family', 'is', 'very', 'happy'], blankIndex: 2, blankOptions: ['is', 'am', 'are', 'be'], situation: '😊 가족이 행복해요', emoji: '😊', category: 'family', level: 2 },
  { sentence: 'I play with my baby sister', korean: '나는 아기 여동생과 놀아요', words: ['I', 'play', 'with', 'my', 'baby', 'sister'], blankIndex: 1, blankOptions: ['play', 'talk', 'sleep', 'eat'], situation: '👶 아기와 놀아요', emoji: '👶', category: 'family', level: 3 },
  { sentence: 'My grandma tells me stories', korean: '할머니가 나에게 이야기를 들려줘요', words: ['My', 'grandma', 'tells', 'me', 'stories'], blankIndex: 2, blankOptions: ['tells', 'says', 'talks', 'speaks'], situation: '👵 할머니와 시간을 보내요', emoji: '👵', category: 'family', level: 3 },
  { sentence: 'My dad drives me to school', korean: '아빠가 학교에 데려다 줘요', words: ['My', 'dad', 'drives', 'me', 'to', 'school'], blankIndex: 2, blankOptions: ['drives', 'takes', 'brings', 'sends'], situation: '🚗 아빠 차 타고 학교 가요', emoji: '🚗', category: 'family', level: 3 },

  // ===== 취미 (Hobbies) =====
  { sentence: 'I like soccer', korean: '나는 축구를 좋아해요', words: ['I', 'like', 'soccer'], blankIndex: 1, blankOptions: ['like', 'play', 'watch', 'know'], situation: '⚽ 축구가 재미있어요', emoji: '⚽', category: 'hobby', level: 1 },
  { sentence: 'I play the piano', korean: '나는 피아노를 쳐요', words: ['I', 'play', 'the', 'piano'], blankIndex: 1, blankOptions: ['play', 'make', 'do', 'like'], situation: '🎹 피아노 연습해요', emoji: '🎹', category: 'hobby', level: 1 },
  { sentence: 'I play computer games', korean: '나는 컴퓨터 게임을 해요', words: ['I', 'play', 'computer', 'games'], blankIndex: 1, blankOptions: ['play', 'watch', 'make', 'buy'], situation: '🎮 게임 시간이에요', emoji: '🎮', category: 'hobby', level: 1 },
  { sentence: 'I sing a song', korean: '나는 노래를 불러요', words: ['I', 'sing', 'a', 'song'], blankIndex: 1, blankOptions: ['sing', 'play', 'listen', 'write'], situation: '🎤 노래 불러요', emoji: '🎤', category: 'hobby', level: 1 },
  { sentence: 'I draw pictures every day', korean: '나는 매일 그림을 그려요', words: ['I', 'draw', 'pictures', 'every', 'day'], blankIndex: 1, blankOptions: ['draw', 'paint', 'make', 'write'], situation: '🖍️ 그림 그리기를 좋아해요', emoji: '🖍️', category: 'hobby', level: 2 },
  { sentence: 'I ride my bicycle', korean: '나는 자전거를 타요', words: ['I', 'ride', 'my', 'bicycle'], blankIndex: 1, blankOptions: ['ride', 'drive', 'play', 'run'], situation: '🚲 자전거 타요', emoji: '🚲', category: 'hobby', level: 2 },
  { sentence: 'I collect toy cars', korean: '나는 장난감 자동차를 수집해요', words: ['I', 'collect', 'toy', 'cars'], blankIndex: 1, blankOptions: ['collect', 'play', 'make', 'buy'], situation: '🚗 장난감 모아요', emoji: '🚗', category: 'hobby', level: 2 },
  { sentence: 'I love reading comic books', korean: '나는 만화책 읽기를 좋아해요', words: ['I', 'love', 'reading', 'comic', 'books'], blankIndex: 1, blankOptions: ['love', 'like', 'hate', 'know'], situation: '📚 만화책 읽어요', emoji: '📚', category: 'hobby', level: 3 },
  { sentence: 'I practice swimming every week', korean: '나는 매주 수영 연습을 해요', words: ['I', 'practice', 'swimming', 'every', 'week'], blankIndex: 1, blankOptions: ['practice', 'play', 'do', 'like'], situation: '🏊 수영장에서 연습해요', emoji: '🏊', category: 'hobby', level: 3 },
  { sentence: 'I build robots with blocks', korean: '나는 블록으로 로봇을 만들어요', words: ['I', 'build', 'robots', 'with', 'blocks'], blankIndex: 1, blankOptions: ['build', 'make', 'play', 'draw'], situation: '🤖 블록 놀이 재밌어요', emoji: '🤖', category: 'hobby', level: 3 },

  // ===== 음식 (Food) =====
  { sentence: 'I eat an apple', korean: '나는 사과를 먹어요', words: ['I', 'eat', 'an', 'apple'], blankIndex: 1, blankOptions: ['eat', 'like', 'buy', 'make'], situation: '🍎 사과를 먹어요', emoji: '🍎', category: 'food', level: 1 },
  { sentence: 'I drink water', korean: '나는 물을 마셔요', words: ['I', 'drink', 'water'], blankIndex: 1, blankOptions: ['drink', 'eat', 'make', 'buy'], situation: '💧 물을 마셔요', emoji: '💧', category: 'food', level: 1 },
  { sentence: 'I like pizza', korean: '나는 피자를 좋아해요', words: ['I', 'like', 'pizza'], blankIndex: 1, blankOptions: ['like', 'eat', 'make', 'buy'], situation: '🍕 피자가 맛있어요', emoji: '🍕', category: 'food', level: 1 },
  { sentence: 'I want some milk', korean: '나는 우유를 원해요', words: ['I', 'want', 'some', 'milk'], blankIndex: 1, blankOptions: ['want', 'drink', 'like', 'need'], situation: '🥛 우유 마시고 싶어요', emoji: '🥛', category: 'food', level: 2 },
  { sentence: 'I eat rice for dinner', korean: '나는 저녁에 밥을 먹어요', words: ['I', 'eat', 'rice', 'for', 'dinner'], blankIndex: 1, blankOptions: ['eat', 'make', 'cook', 'buy'], situation: '🍚 저녁 식사 시간이에요', emoji: '🍚', category: 'food', level: 2 },
  { sentence: 'I love chocolate cake', korean: '나는 초콜릿 케이크를 좋아해요', words: ['I', 'love', 'chocolate', 'cake'], blankIndex: 1, blankOptions: ['love', 'like', 'eat', 'make'], situation: '🎂 케이크가 최고예요', emoji: '🎂', category: 'food', level: 2 },
  { sentence: 'My favorite food is ice cream', korean: '내가 제일 좋아하는 음식은 아이스크림이에요', words: ['My', 'favorite', 'food', 'is', 'ice', 'cream'], blankIndex: 3, blankOptions: ['is', 'am', 'are', 'be'], situation: '🍦 아이스크림을 제일 좋아해요', emoji: '🍦', category: 'food', level: 3 },
  { sentence: 'I always eat vegetables', korean: '나는 항상 채소를 먹어요', words: ['I', 'always', 'eat', 'vegetables'], blankIndex: 2, blankOptions: ['eat', 'like', 'cook', 'buy'], situation: '🥦 건강한 음식을 먹어요', emoji: '🥦', category: 'food', level: 3 },
  { sentence: 'I drink orange juice for breakfast', korean: '나는 아침에 오렌지 주스를 마셔요', words: ['I', 'drink', 'orange', 'juice', 'for', 'breakfast'], blankIndex: 1, blankOptions: ['drink', 'eat', 'like', 'make'], situation: '🧃 아침에 주스 마셔요', emoji: '🧃', category: 'food', level: 3 },
  { sentence: 'I help mom cook dinner', korean: '나는 엄마가 저녁 만드는 걸 도와요', words: ['I', 'help', 'mom', 'cook', 'dinner'], blankIndex: 1, blankOptions: ['help', 'see', 'watch', 'call'], situation: '👩‍🍳 요리 도와드려요', emoji: '👩‍🍳', category: 'food', level: 3 },

  // ===== 날씨/계절 (Weather/Seasons) =====
  { sentence: 'It is sunny today', korean: '오늘은 맑아요', words: ['It', 'is', 'sunny', 'today'], blankIndex: 1, blankOptions: ['is', 'am', 'are', 'be'], situation: '☀️ 날씨가 좋아요', emoji: '☀️', category: 'weather', level: 1 },
  { sentence: 'It is raining now', korean: '지금 비가 와요', words: ['It', 'is', 'raining', 'now'], blankIndex: 1, blankOptions: ['is', 'am', 'are', 'be'], situation: '🌧️ 비 오는 날', emoji: '🌧️', category: 'weather', level: 1 },
  { sentence: 'I like spring', korean: '나는 봄을 좋아해요', words: ['I', 'like', 'spring'], blankIndex: 1, blankOptions: ['like', 'love', 'know', 'see'], situation: '🌸 봄이 좋아요', emoji: '🌸', category: 'weather', level: 1 },
  { sentence: 'It is very hot', korean: '아주 더워요', words: ['It', 'is', 'very', 'hot'], blankIndex: 3, blankOptions: ['hot', 'cold', 'warm', 'cool'], situation: '🥵 여름이라 더워요', emoji: '🥵', category: 'weather', level: 1 },
  { sentence: 'It is very cold', korean: '아주 추워요', words: ['It', 'is', 'very', 'cold'], blankIndex: 3, blankOptions: ['cold', 'hot', 'warm', 'cool'], situation: '🥶 겨울이라 추워요', emoji: '🥶', category: 'weather', level: 1 },
  { sentence: 'I need an umbrella', korean: '나는 우산이 필요해요', words: ['I', 'need', 'an', 'umbrella'], blankIndex: 1, blankOptions: ['need', 'want', 'have', 'take'], situation: '☔ 비 오니까 우산 챙겨요', emoji: '☔', category: 'weather', level: 2 },
  { sentence: 'I love winter because of snow', korean: '나는 눈 때문에 겨울을 좋아해요', words: ['I', 'love', 'winter', 'because', 'of', 'snow'], blankIndex: 1, blankOptions: ['love', 'like', 'hate', 'know'], situation: '⛄ 눈이 와요', emoji: '⛄', category: 'weather', level: 3 },
  { sentence: 'The wind is blowing hard', korean: '바람이 세게 불어요', words: ['The', 'wind', 'is', 'blowing', 'hard'], blankIndex: 2, blankOptions: ['is', 'am', 'are', 'be'], situation: '💨 바람이 불어요', emoji: '💨', category: 'weather', level: 3 },
  { sentence: 'I can see a rainbow', korean: '나는 무지개를 볼 수 있어요', words: ['I', 'can', 'see', 'a', 'rainbow'], blankIndex: 1, blankOptions: ['can', 'will', 'do', 'am'], situation: '🌈 무지개가 떴어요', emoji: '🌈', category: 'weather', level: 2 },
  { sentence: 'I wear a coat in winter', korean: '나는 겨울에 코트를 입어요', words: ['I', 'wear', 'a', 'coat', 'in', 'winter'], blankIndex: 1, blankOptions: ['wear', 'put', 'take', 'have'], situation: '🧥 겨울 옷 입어요', emoji: '🧥', category: 'weather', level: 2 },

  // ===== 시간 (Time) =====
  { sentence: 'It is morning', korean: '아침이에요', words: ['It', 'is', 'morning'], blankIndex: 1, blankOptions: ['is', 'am', 'are', 'be'], situation: '🌅 아침 시간', emoji: '🌅', category: 'time', level: 1 },
  { sentence: 'It is night time', korean: '밤이에요', words: ['It', 'is', 'night', 'time'], blankIndex: 1, blankOptions: ['is', 'am', 'are', 'be'], situation: '🌙 밤 시간', emoji: '🌙', category: 'time', level: 1 },
  { sentence: 'I wake up at seven', korean: '나는 7시에 일어나요', words: ['I', 'wake', 'up', 'at', 'seven'], blankIndex: 1, blankOptions: ['wake', 'get', 'stand', 'sit'], situation: '⏰ 아침 7시', emoji: '⏰', category: 'time', level: 2 },
  { sentence: 'School starts at nine', korean: '학교는 9시에 시작해요', words: ['School', 'starts', 'at', 'nine'], blankIndex: 1, blankOptions: ['starts', 'begins', 'opens', 'ends'], situation: '🕘 9시에 등교', emoji: '🕘', category: 'time', level: 2 },
  { sentence: 'I eat lunch at noon', korean: '나는 정오에 점심을 먹어요', words: ['I', 'eat', 'lunch', 'at', 'noon'], blankIndex: 1, blankOptions: ['eat', 'have', 'take', 'make'], situation: '🕛 12시 점심 시간', emoji: '🕛', category: 'time', level: 2 },
  { sentence: 'Today is Monday', korean: '오늘은 월요일이에요', words: ['Today', 'is', 'Monday'], blankIndex: 1, blankOptions: ['is', 'am', 'are', 'be'], situation: '📅 월요일', emoji: '📅', category: 'time', level: 2 },
  { sentence: 'Tomorrow is my birthday', korean: '내일은 내 생일이에요', words: ['Tomorrow', 'is', 'my', 'birthday'], blankIndex: 1, blankOptions: ['is', 'am', 'are', 'be'], situation: '🎂 생일 전날', emoji: '🎂', category: 'time', level: 2 },
  { sentence: 'I sleep for eight hours', korean: '나는 8시간 자요', words: ['I', 'sleep', 'for', 'eight', 'hours'], blankIndex: 1, blankOptions: ['sleep', 'rest', 'wake', 'work'], situation: '😴 충분한 수면', emoji: '😴', category: 'time', level: 3 },

  // ===== 숫자/세기 (Numbers/Counting) =====
  { sentence: 'I have two eyes', korean: '나는 눈이 두 개 있어요', words: ['I', 'have', 'two', 'eyes'], blankIndex: 2, blankOptions: ['two', 'one', 'three', 'four'], situation: '👀 눈 두 개', emoji: '👀', category: 'numbers', level: 1 },
  { sentence: 'I have ten fingers', korean: '나는 손가락이 열 개 있어요', words: ['I', 'have', 'ten', 'fingers'], blankIndex: 2, blankOptions: ['ten', 'five', 'eight', 'twelve'], situation: '✋ 손가락 10개', emoji: '✋', category: 'numbers', level: 1 },
  { sentence: 'I am seven years old', korean: '나는 일곱 살이에요', words: ['I', 'am', 'seven', 'years', 'old'], blankIndex: 1, blankOptions: ['am', 'is', 'are', 'be'], situation: '7️⃣ 일곱 살', emoji: '7️⃣', category: 'numbers', level: 2 },
  { sentence: 'There are five apples', korean: '사과가 다섯 개 있어요', words: ['There', 'are', 'five', 'apples'], blankIndex: 1, blankOptions: ['are', 'is', 'am', 'be'], situation: '🍎 사과 5개', emoji: '🍎', category: 'numbers', level: 2 },
  { sentence: 'I can count to twenty', korean: '나는 20까지 셀 수 있어요', words: ['I', 'can', 'count', 'to', 'twenty'], blankIndex: 1, blankOptions: ['can', 'will', 'do', 'am'], situation: '🔢 숫자 세기', emoji: '🔢', category: 'numbers', level: 2 },

  // ===== 동물 추가 (More Animals) =====
  { sentence: 'I see a bird', korean: '나는 새를 봐요', words: ['I', 'see', 'a', 'bird'], blankIndex: 1, blankOptions: ['see', 'hear', 'like', 'have'], situation: '🐦 하늘에 새가 있어요', emoji: '🐦', category: 'animals', level: 1 },
  { sentence: 'The cat is sleeping', korean: '고양이가 자고 있어요', words: ['The', 'cat', 'is', 'sleeping'], blankIndex: 2, blankOptions: ['is', 'am', 'are', 'be'], situation: '😺 고양이가 낮잠 자요', emoji: '😺', category: 'animals', level: 1 },
  { sentence: 'The dog is running fast', korean: '개가 빠르게 달려요', words: ['The', 'dog', 'is', 'running', 'fast'], blankIndex: 2, blankOptions: ['is', 'am', 'are', 'be'], situation: '🐕 강아지가 뛰어요', emoji: '🐕', category: 'animals', level: 2 },
  { sentence: 'I feed my pet fish', korean: '나는 애완 물고기에게 먹이를 줘요', words: ['I', 'feed', 'my', 'pet', 'fish'], blankIndex: 1, blankOptions: ['feed', 'give', 'see', 'like'], situation: '🐠 물고기 밥 주기', emoji: '🐠', category: 'animals', level: 2 },
  { sentence: 'The bunny hops very high', korean: '토끼가 아주 높이 뛰어요', words: ['The', 'bunny', 'hops', 'very', 'high'], blankIndex: 2, blankOptions: ['hops', 'jumps', 'runs', 'walks'], situation: '🐰 토끼가 깡충깡충', emoji: '🐰', category: 'animals', level: 3 },

  // ===== 감정 추가 (More Feelings) =====
  { sentence: 'I am excited', korean: '나는 신나요', words: ['I', 'am', 'excited'], blankIndex: 1, blankOptions: ['am', 'is', 'are', 'be'], situation: '🤩 신나는 일이 생겼어요', emoji: '🤩', category: 'feelings', level: 1 },
  { sentence: 'I am tired', korean: '나는 피곤해요', words: ['I', 'am', 'tired'], blankIndex: 1, blankOptions: ['am', 'is', 'are', 'be'], situation: '😫 피곤해요', emoji: '😫', category: 'feelings', level: 1 },
  { sentence: 'I am scared', korean: '나는 무서워요', words: ['I', 'am', 'scared'], blankIndex: 1, blankOptions: ['am', 'is', 'are', 'be'], situation: '😨 무서운 영화 봤어요', emoji: '😨', category: 'feelings', level: 1 },
  { sentence: 'I am proud of myself', korean: '나는 자랑스러워요', words: ['I', 'am', 'proud', 'of', 'myself'], blankIndex: 1, blankOptions: ['am', 'is', 'are', 'be'], situation: '😌 잘했어요', emoji: '😌', category: 'feelings', level: 2 },
  { sentence: 'I feel sleepy', korean: '나는 졸려요', words: ['I', 'feel', 'sleepy'], blankIndex: 1, blankOptions: ['feel', 'am', 'look', 'seem'], situation: '😪 졸음이 와요', emoji: '😪', category: 'feelings', level: 2 },

  // ===== 건강 (Health) =====
  { sentence: 'I am healthy', korean: '나는 건강해요', words: ['I', 'am', 'healthy'], blankIndex: 1, blankOptions: ['am', 'is', 'are', 'be'], situation: '💪 건강해요', emoji: '💪', category: 'health', level: 1 },
  { sentence: 'I have a cold', korean: '나는 감기에 걸렸어요', words: ['I', 'have', 'a', 'cold'], blankIndex: 1, blankOptions: ['have', 'has', 'am', 'get'], situation: '🤧 감기 걸렸어요', emoji: '🤧', category: 'health', level: 2 },
  { sentence: 'I go to the doctor', korean: '나는 의사에게 가요', words: ['I', 'go', 'to', 'the', 'doctor'], blankIndex: 1, blankOptions: ['go', 'come', 'walk', 'run'], situation: '👨‍⚕️ 병원 가요', emoji: '👨‍⚕️', category: 'health', level: 2 },
  { sentence: 'I take medicine when sick', korean: '나는 아플 때 약을 먹어요', words: ['I', 'take', 'medicine', 'when', 'sick'], blankIndex: 1, blankOptions: ['take', 'eat', 'drink', 'have'], situation: '💊 약 먹어요', emoji: '💊', category: 'health', level: 3 },
  { sentence: 'I exercise every morning', korean: '나는 매일 아침 운동해요', words: ['I', 'exercise', 'every', 'morning'], blankIndex: 1, blankOptions: ['exercise', 'play', 'work', 'study'], situation: '🏃 아침 운동', emoji: '🏃', category: 'health', level: 3 },

  // ===== 쇼핑 (Shopping) =====
  { sentence: 'I go shopping', korean: '나는 쇼핑을 가요', words: ['I', 'go', 'shopping'], blankIndex: 1, blankOptions: ['go', 'come', 'like', 'want'], situation: '🛍️ 쇼핑하러 가요', emoji: '🛍️', category: 'shopping', level: 1 },
  { sentence: 'I buy new shoes', korean: '나는 새 신발을 사요', words: ['I', 'buy', 'new', 'shoes'], blankIndex: 1, blankOptions: ['buy', 'get', 'take', 'have'], situation: '👟 신발 사요', emoji: '👟', category: 'shopping', level: 2 },
  { sentence: 'How much is this', korean: '이거 얼마예요', words: ['How', 'much', 'is', 'this'], blankIndex: 2, blankOptions: ['is', 'am', 'are', 'be'], situation: '💵 가격 물어봐요', emoji: '💵', category: 'shopping', level: 2 },
  { sentence: 'I want to buy a toy', korean: '나는 장난감을 사고 싶어요', words: ['I', 'want', 'to', 'buy', 'a', 'toy'], blankIndex: 1, blankOptions: ['want', 'need', 'like', 'have'], situation: '🧸 장난감 사고 싶어요', emoji: '🧸', category: 'shopping', level: 3 },

  // ===== 여행 (Travel) =====
  { sentence: 'I go on a trip', korean: '나는 여행을 가요', words: ['I', 'go', 'on', 'a', 'trip'], blankIndex: 1, blankOptions: ['go', 'come', 'take', 'have'], situation: '✈️ 여행 가요', emoji: '✈️', category: 'travel', level: 2 },
  { sentence: 'I ride a train', korean: '나는 기차를 타요', words: ['I', 'ride', 'a', 'train'], blankIndex: 1, blankOptions: ['ride', 'take', 'drive', 'catch'], situation: '🚂 기차 여행', emoji: '🚂', category: 'travel', level: 2 },
  { sentence: 'I visit the beach', korean: '나는 해변을 방문해요', words: ['I', 'visit', 'the', 'beach'], blankIndex: 1, blankOptions: ['visit', 'go', 'see', 'like'], situation: '🏖️ 바다 놀러 가요', emoji: '🏖️', category: 'travel', level: 2 },
  { sentence: 'I pack my suitcase', korean: '나는 여행 가방을 싸요', words: ['I', 'pack', 'my', 'suitcase'], blankIndex: 1, blankOptions: ['pack', 'take', 'carry', 'bring'], situation: '🧳 짐 싸요', emoji: '🧳', category: 'travel', level: 3 },
  { sentence: 'I take pictures on vacation', korean: '나는 휴가에 사진을 찍어요', words: ['I', 'take', 'pictures', 'on', 'vacation'], blankIndex: 1, blankOptions: ['take', 'make', 'do', 'see'], situation: '📸 여행 사진', emoji: '📸', category: 'travel', level: 3 },
];

// 총 150개 이상의 문장!
