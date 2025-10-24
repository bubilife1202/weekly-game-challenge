import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Card as CardType, Difficulty } from '../types';
import { generateCards, difficultyConfig, calculateAccuracy } from '../utils/helpers';
import { soundManager } from '../utils/sound';
import { useProfileStore } from '../store/profileStore';
import { useGameStore } from '../store/gameStore';
import { MemoryCard } from '../components/game/MemoryCard';
import { ResultModal } from '../components/game/ResultModal';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';

export const MemoryGame = () => {
  const navigate = useNavigate();
  const { currentProfileId } = useProfileStore();
  const { addRecord, getProfileStats } = useGameStore();

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // 난이도 선택 화면
  if (!difficulty) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="🃏 카드 뒤집기" showBack />
        <div className="max-w-2xl mx-auto p-4 space-y-6 py-8">
          <div className="text-center space-y-4">
            <div className="text-6xl">🃏</div>
            <h2 className="text-2xl font-bold text-textDark">
              난이도를 선택하세요
            </h2>
            <p className="text-gray-600">같은 그림을 찾아보세요!</p>
          </div>

          <div className="space-y-4">
            {(Object.entries(difficultyConfig) as [Difficulty, typeof difficultyConfig.easy][]).map(
              ([key, config]) => (
                <button
                  key={key}
                  onClick={() => setDifficulty(key)}
                  className="w-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 active:scale-95"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-xl font-bold text-textDark mb-1">
                        {config.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {config.pairs}쌍 ({config.rows} × {config.cols})
                      </div>
                    </div>
                    <div className="text-3xl">→</div>
                  </div>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // 게임 초기화
  useEffect(() => {
    if (difficulty) {
      const config = difficultyConfig[difficulty];
      const newCards = generateCards(config.pairs);
      setCards(newCards);
      setStartTime(Date.now());
    }
  }, [difficulty]);

  // 카드 클릭 핸들러
  const handleCardClick = (cardId: string) => {
    if (isChecking || flippedCards.length >= 2) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isMatched) return;

    soundManager.playCardFlip();

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // 카드 뒤집기
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    // 두 장이 뒤집혔을 때
    if (newFlippedCards.length === 2) {
      setAttempts((prev) => prev + 1);
      setIsChecking(true);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // 짝 맞음
        soundManager.playMatch();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
          setIsChecking(false);
        }, 600);
      } else {
        // 짝 틀림
        soundManager.playMismatch();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  // 게임 완료 체크
  useEffect(() => {
    if (difficulty && matchedPairs === difficultyConfig[difficulty].pairs) {
      const endTimeValue = Date.now();
      setEndTime(endTimeValue);
      soundManager.playComplete();

      // 게임 기록 저장
      if (currentProfileId && startTime) {
        const time = Math.floor((endTimeValue - startTime) / 1000);
        const accuracy = calculateAccuracy(matchedPairs, attempts);

        const record = {
          profileId: currentProfileId,
          gameType: 'memory' as const,
          difficulty,
          score: matchedPairs,
          time,
          attempts,
          accuracy,
          completedAt: endTimeValue,
        };

        addRecord(record);
      }

      setTimeout(() => setShowResult(true), 500);
    }
  }, [matchedPairs, difficulty]);

  const handlePlayAgain = () => {
    if (difficulty) {
      const config = difficultyConfig[difficulty];
      const newCards = generateCards(config.pairs);
      setCards(newCards);
      setFlippedCards([]);
      setMatchedPairs(0);
      setAttempts(0);
      setStartTime(Date.now());
      setEndTime(null);
      setShowResult(false);
      setIsChecking(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const config = difficultyConfig[difficulty];
  const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const finalTime = startTime && endTime ? Math.floor((endTime - startTime) / 1000) : 0;

  // 신기록 여부 확인
  const stats = currentProfileId ? getProfileStats(currentProfileId) : null;
  const previousBest = stats?.bestRecords[difficulty];
  const isNewRecord = !previousBest || finalTime < previousBest.time;

  const accuracy = calculateAccuracy(matchedPairs, attempts);

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={`🃏 ${config.name}`}
        showBack
        rightElement={
          <div className="flex items-center gap-4">
            <div className="text-lg font-bold text-primary">
              ⏱ {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
            </div>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* 게임 정보 */}
        <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-md">
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-secondary">{attempts}</div>
            <div className="text-sm text-gray-600">시도</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-success">
              {matchedPairs}/{config.pairs}
            </div>
            <div className="text-sm text-gray-600">찾음</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-warning">{accuracy}%</div>
            <div className="text-sm text-gray-600">정확도</div>
          </div>
        </div>

        {/* 게임 보드 */}
        <div
          className="grid gap-3 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
            maxWidth: config.cols * 100,
          }}
        >
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card.id)}
              disabled={isChecking}
            />
          ))}
        </div>

        {/* 다시 시작 버튼 */}
        <div className="pt-4">
          <Button
            variant="secondary"
            size="medium"
            fullWidth
            onClick={handlePlayAgain}
          >
            🔄 다시 시작
          </Button>
        </div>
      </div>

      {/* 결과 모달 */}
      <ResultModal
        isOpen={showResult}
        time={finalTime}
        attempts={attempts}
        accuracy={accuracy}
        isNewRecord={isNewRecord}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
    </div>
  );
};
