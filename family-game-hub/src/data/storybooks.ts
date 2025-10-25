// 영어 동화책 데이터
export type StoryPage = {
  text: string;
  korean: string;
  image: string; // emoji로 대체
};

export type Storybook = {
  id: string;
  title: string;
  titleKorean: string;
  level: number; // 1: 쉬움, 2: 보통, 3: 어려움
  category: string;
  pages: StoryPage[];
  coverEmoji: string;
};

export const storybooks: Storybook[] = [
  // ===== 레벨 1: 쉬운 동화 =====
  {
    id: 'hungry-cat',
    title: 'The Hungry Cat',
    titleKorean: '배고픈 고양이',
    level: 1,
    category: 'animals',
    coverEmoji: '😺',
    pages: [
      {
        text: 'There is a little cat.',
        korean: '작은 고양이 한 마리가 있어요.',
        image: '😺'
      },
      {
        text: 'The cat is very hungry.',
        korean: '고양이는 매우 배가 고파요.',
        image: '😿'
      },
      {
        text: 'The cat sees a fish.',
        korean: '고양이가 물고기를 봐요.',
        image: '🐟'
      },
      {
        text: 'The cat eats the fish.',
        korean: '고양이가 물고기를 먹어요.',
        image: '😋'
      },
      {
        text: 'Now the cat is happy!',
        korean: '이제 고양이는 행복해요!',
        image: '😸'
      }
    ]
  },
  {
    id: 'happy-dog',
    title: 'The Happy Dog',
    titleKorean: '행복한 강아지',
    level: 1,
    category: 'animals',
    coverEmoji: '🐕',
    pages: [
      {
        text: 'I have a dog.',
        korean: '나는 강아지가 있어요.',
        image: '🐕'
      },
      {
        text: 'My dog is very happy.',
        korean: '내 강아지는 매우 행복해요.',
        image: '😊'
      },
      {
        text: 'We play in the park.',
        korean: '우리는 공원에서 놀아요.',
        image: '🏞️'
      },
      {
        text: 'My dog runs very fast.',
        korean: '내 강아지는 매우 빨리 달려요.',
        image: '💨'
      },
      {
        text: 'I love my dog!',
        korean: '나는 내 강아지를 사랑해요!',
        image: '❤️'
      }
    ]
  },
  {
    id: 'my-family',
    title: 'My Family',
    titleKorean: '우리 가족',
    level: 1,
    category: 'family',
    coverEmoji: '👨‍👩‍👧‍👦',
    pages: [
      {
        text: 'This is my family.',
        korean: '이것은 우리 가족이에요.',
        image: '👨‍👩‍👧‍👦'
      },
      {
        text: 'I have a mom and a dad.',
        korean: '나는 엄마와 아빠가 있어요.',
        image: '👨‍👩'
      },
      {
        text: 'I have a little sister.',
        korean: '나는 여동생이 있어요.',
        image: '👧'
      },
      {
        text: 'We love each other.',
        korean: '우리는 서로 사랑해요.',
        image: '💕'
      },
      {
        text: 'My family is the best!',
        korean: '우리 가족이 최고예요!',
        image: '🌟'
      }
    ]
  },

  // ===== 레벨 2: 중급 동화 =====
  {
    id: 'rainy-day',
    title: 'A Rainy Day',
    titleKorean: '비 오는 날',
    level: 2,
    category: 'weather',
    coverEmoji: '🌧️',
    pages: [
      {
        text: 'Today is a rainy day.',
        korean: '오늘은 비가 오는 날이에요.',
        image: '🌧️'
      },
      {
        text: 'I cannot go outside to play.',
        korean: '밖에 나가서 놀 수 없어요.',
        image: '😔'
      },
      {
        text: 'But I have a good idea!',
        korean: '하지만 좋은 생각이 있어요!',
        image: '💡'
      },
      {
        text: 'I will read books at home.',
        korean: '집에서 책을 읽을 거예요.',
        image: '📚'
      },
      {
        text: 'I can also draw pictures.',
        korean: '그림도 그릴 수 있어요.',
        image: '🎨'
      },
      {
        text: 'Rainy days can be fun too!',
        korean: '비 오는 날도 재미있을 수 있어요!',
        image: '😊'
      }
    ]
  },
  {
    id: 'birthday-party',
    title: 'My Birthday Party',
    titleKorean: '내 생일 파티',
    level: 2,
    category: 'daily',
    coverEmoji: '🎂',
    pages: [
      {
        text: 'Tomorrow is my birthday!',
        korean: '내일은 내 생일이에요!',
        image: '🎂'
      },
      {
        text: 'I will have a big party.',
        korean: '큰 파티를 할 거예요.',
        image: '🎉'
      },
      {
        text: 'My friends will come to my house.',
        korean: '친구들이 우리 집에 올 거예요.',
        image: '👫'
      },
      {
        text: 'We will eat cake and play games.',
        korean: '케이크를 먹고 게임을 할 거예요.',
        image: '🍰'
      },
      {
        text: 'I am so excited!',
        korean: '너무 신나요!',
        image: '🤩'
      },
      {
        text: 'I cannot wait for tomorrow!',
        korean: '내일이 기다려져요!',
        image: '⏰'
      }
    ]
  },
  {
    id: 'school-trip',
    title: 'Our School Trip',
    titleKorean: '우리의 학교 여행',
    level: 2,
    category: 'school',
    coverEmoji: '🚌',
    pages: [
      {
        text: 'Last week we went on a school trip.',
        korean: '지난주에 우리는 학교 여행을 갔어요.',
        image: '🚌'
      },
      {
        text: 'We visited a big museum.',
        korean: '큰 박물관을 방문했어요.',
        image: '🏛️'
      },
      {
        text: 'I saw many interesting things.',
        korean: '많은 흥미로운 것들을 봤어요.',
        image: '👀'
      },
      {
        text: 'My teacher told us about dinosaurs.',
        korean: '선생님이 공룡에 대해 말씀해주셨어요.',
        image: '🦕'
      },
      {
        text: 'We ate lunch in the park.',
        korean: '공원에서 점심을 먹었어요.',
        image: '🍱'
      },
      {
        text: 'It was the best day ever!',
        korean: '최고의 날이었어요!',
        image: '🌟'
      }
    ]
  },

  // ===== 레벨 3: 고급 동화 =====
  {
    id: 'lost-puppy',
    title: 'The Lost Puppy',
    titleKorean: '길 잃은 강아지',
    level: 3,
    category: 'animals',
    coverEmoji: '🐶',
    pages: [
      {
        text: 'One day I was walking home from school.',
        korean: '어느 날 나는 학교에서 집으로 걸어가고 있었어요.',
        image: '🚶'
      },
      {
        text: 'Suddenly I heard a strange sound.',
        korean: '갑자기 이상한 소리가 들렸어요.',
        image: '👂'
      },
      {
        text: 'It was a little puppy crying under a tree.',
        korean: '나무 아래에서 작은 강아지가 울고 있었어요.',
        image: '🐶'
      },
      {
        text: 'The puppy looked very scared and hungry.',
        korean: '강아지는 매우 무서워하고 배고파 보였어요.',
        image: '😰'
      },
      {
        text: 'I gave the puppy some food from my backpack.',
        korean: '나는 가방에서 음식을 꺼내 강아지에게 줬어요.',
        image: '🍖'
      },
      {
        text: 'The puppy started to wag its tail happily.',
        korean: '강아지는 행복하게 꼬리를 흔들기 시작했어요.',
        image: '😊'
      },
      {
        text: 'I took the puppy to the police station.',
        korean: '나는 강아지를 경찰서로 데려갔어요.',
        image: '👮'
      },
      {
        text: 'The next day the owner came to get the puppy.',
        korean: '다음 날 주인이 강아지를 데리러 왔어요.',
        image: '👨'
      },
      {
        text: 'They were so happy to see each other!',
        korean: '그들은 서로를 보고 너무 행복해했어요!',
        image: '💕'
      },
      {
        text: 'I felt proud that I had helped someone.',
        korean: '누군가를 도와서 자랑스러웠어요.',
        image: '😌'
      }
    ]
  },
  {
    id: 'dream-adventure',
    title: 'My Dream Adventure',
    titleKorean: '내 꿈속 모험',
    level: 3,
    category: 'feelings',
    coverEmoji: '✨',
    pages: [
      {
        text: 'Last night I had the most amazing dream.',
        korean: '어젯밤에 가장 놀라운 꿈을 꿨어요.',
        image: '💭'
      },
      {
        text: 'I was flying high above the clouds.',
        korean: '구름 위를 높이 날고 있었어요.',
        image: '☁️'
      },
      {
        text: 'Below me I could see my whole city.',
        korean: '아래로 우리 도시 전체가 보였어요.',
        image: '🌆'
      },
      {
        text: 'Then I met a friendly dragon in the sky.',
        korean: '그때 하늘에서 친근한 용을 만났어요.',
        image: '🐉'
      },
      {
        text: 'The dragon took me to a magical island.',
        korean: '용이 나를 마법의 섬으로 데려갔어요.',
        image: '🏝️'
      },
      {
        text: 'On the island everything was made of candy.',
        korean: '섬에 있는 모든 것이 사탕으로 만들어져 있었어요.',
        image: '🍭'
      },
      {
        text: 'I played with talking animals all day long.',
        korean: '하루 종일 말하는 동물들과 놀았어요.',
        image: '🦁'
      },
      {
        text: 'When I woke up I felt very happy.',
        korean: '일어났을 때 매우 행복했어요.',
        image: '😊'
      },
      {
        text: 'I wish I could visit that island again!',
        korean: '그 섬을 다시 방문할 수 있었으면 좋겠어요!',
        image: '✨'
      }
    ]
  },
  {
    id: 'helping-grandma',
    title: 'Helping Grandma',
    titleKorean: '할머니 돕기',
    level: 3,
    category: 'family',
    coverEmoji: '👵',
    pages: [
      {
        text: 'Every weekend I visit my grandmother.',
        korean: '매주 주말마다 나는 할머니를 방문해요.',
        image: '👵'
      },
      {
        text: 'She lives alone in a small house.',
        korean: '할머니는 작은 집에 혼자 사세요.',
        image: '🏠'
      },
      {
        text: 'I always help her with the housework.',
        korean: '나는 항상 할머니의 집안일을 도와드려요.',
        image: '🧹'
      },
      {
        text: 'Together we clean the house and water the plants.',
        korean: '함께 집을 청소하고 식물에 물을 줘요.',
        image: '🌱'
      },
      {
        text: 'After we finish she makes me delicious cookies.',
        korean: '끝나고 나면 할머니가 맛있는 쿠키를 만들어주세요.',
        image: '🍪'
      },
      {
        text: 'We sit together and she tells me old stories.',
        korean: '함께 앉아서 할머니는 옛날 이야기를 들려주세요.',
        image: '📖'
      },
      {
        text: 'She talks about when she was young.',
        korean: '할머니가 젊었을 때 이야기를 하세요.',
        image: '👧'
      },
      {
        text: 'I love spending time with my grandmother.',
        korean: '나는 할머니와 시간을 보내는 것을 좋아해요.',
        image: '💖'
      },
      {
        text: 'She says I am her favorite grandchild!',
        korean: '할머니는 내가 제일 좋아하는 손주라고 말씀하세요!',
        image: '🌟'
      }
    ]
  }
];

// 레벨별 책 필터링
export const getBooksByLevel = (level: number): Storybook[] => {
  return storybooks.filter(book => book.level === level);
};

// 카테고리별 책 필터링
export const getBooksByCategory = (category: string): Storybook[] => {
  return storybooks.filter(book => book.category === category);
};
