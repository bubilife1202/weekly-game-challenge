import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profileStore';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import type { AgeGroup, Difficulty, GameCategory, GamePreference } from '../types';

const availableEmojis = [
  '😊', '😍', '🤗', '🥰', '😎', '🤓', '👦', '👧', '👨', '👩',
  '🧑', '👴', '👵', '🐶', '🐱', '🐼', '🐨', '🦊', '🐯', '🦁',
];

const availableColors = [
  '#FF6B6B', '#4ECDC4', '#95E1D3', '#FFE66D', '#A8DADC',
  '#F38181', '#AA96DA', '#FCBAD3', '#FFFFD2', '#A8E6CF',
];

export const Profiles = () => {
  const navigate = useNavigate();
  const { profiles, addProfile, deleteProfile, setCurrentProfile } = useProfileStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const defaultPreferences: GamePreference = {
    favoriteTypes: ['puzzle'],
    preferredDifficulty: 'easy',
    ageGroup: 'family',
  };
  const createProfileState = () => ({
    name: '',
    emoji: availableEmojis[0],
    color: availableColors[0],
    age: undefined as number | undefined,
    preferences: { ...defaultPreferences, favoriteTypes: [...defaultPreferences.favoriteTypes] },
  });

  const [newProfile, setNewProfile] = useState(createProfileState());

  const handleAddProfile = () => {
    if (newProfile.name.trim() && newProfile.preferences.favoriteTypes.length > 0) {
      // 랜덤 이모지와 색상 선택
      const randomEmoji = availableEmojis[Math.floor(Math.random() * availableEmojis.length)];
      const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];

      addProfile({
        ...newProfile,
        emoji: randomEmoji,
        color: randomColor,
        preferences: {
          ...newProfile.preferences,
          favoriteTypes: [...newProfile.preferences.favoriteTypes],
        },
      });

      setNewProfile(createProfileState());
      setFormStep(1);
      setShowAddForm(false);
    }
  };

  const handleDeleteProfile = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteProfile(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="👨‍👩‍👧‍👦 우리 가족"
        showBack
        rightElement={
          profiles.length > 0 ? (
            <Button
              variant="primary"
              size="small"
              onClick={() => navigate('/')}
            >
              완료
            </Button>
          ) : null
        }
      />

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* 프로필 목록 */}
        <div className="space-y-3">
          {profiles.map((profile) => (
            <Card key={profile.id}>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setCurrentProfile(profile.id);
                    navigate('/');
                  }}
                  className="flex items-center gap-4 flex-1 text-left"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md"
                    style={{ backgroundColor: profile.color }}
                  >
                    {profile.emoji}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-textDark">
                      {profile.name}
                    </div>
                    {profile.age && (
                      <div className="text-sm text-gray-600">
                        {profile.age}세
                      </div>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => handleDeleteProfile(profile.id)}
                  className="text-2xl text-red-500 hover:scale-110 transition-transform active:scale-95 p-2"
                >
                  🗑️
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* 추가 버튼 */}
        {!showAddForm && (
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={() => setShowAddForm(true)}
          >
            + 가족 추가하기
          </Button>
        )}

        {/* 추가 폼 */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-textDark">
                    새 프로필 만들기
                  </h3>

                  <div className="flex gap-2 text-sm text-gray-600">
                    <span className={formStep === 1 ? 'font-bold text-primary' : ''}>1. 기본 정보</span>
                    <span>→</span>
                    <span className={formStep === 2 ? 'font-bold text-primary' : ''}>2. 선호 설문</span>
                  </div>

                  {formStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          이름만 입력하세요
                        </label>
                        <input
                          type="text"
                          value={newProfile.name}
                          onChange={(e) =>
                            setNewProfile({ ...newProfile, name: e.target.value })
                          }
                          placeholder="예: 홍길동"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary focus:outline-none text-lg"
                          autoFocus
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          ✨ 아이콘과 색상은 자동으로 설정됩니다
                        </p>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          variant="secondary"
                          size="medium"
                          fullWidth
                          onClick={() => {
                            setShowAddForm(false);
                            setFormStep(1);
                            setNewProfile(createProfileState());
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          variant="primary"
                          size="medium"
                          fullWidth
                          onClick={() => setFormStep(2)}
                          disabled={!newProfile.name.trim()}
                        >
                          다음
                        </Button>
                      </div>
                    </div>
                  )}

                  {formStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            좋아하는 게임 타입
                          </label>
                          <span className="text-xs text-gray-500">최소 1개 선택</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {(
                            [
                              { key: 'puzzle', label: '퍼즐' },
                              { key: 'learning', label: '학습' },
                              { key: 'action', label: '액션' },
                              { key: 'arcade', label: '아케이드' },
                              { key: 'creativity', label: '창의' },
                              { key: 'competitive', label: '경쟁' },
                              { key: 'cooperative', label: '협동' },
                              { key: 'strategy', label: '전략' },
                            ] satisfies { key: GameCategory; label: string }[]
                          ).map((type) => {
                            const selected = newProfile.preferences.favoriteTypes.includes(type.key);
                            return (
                              <button
                                key={type.key}
                                onClick={() => {
                                  const nextTypes = selected
                                    ? newProfile.preferences.favoriteTypes.filter((t) => t !== type.key)
                                    : [...newProfile.preferences.favoriteTypes, type.key];
                                  setNewProfile({
                                    ...newProfile,
                                    preferences: { ...newProfile.preferences, favoriteTypes: nextTypes },
                                  });
                                }}
                                className={`rounded-xl border-2 px-3 py-2 text-sm transition shadow-sm ${
                                  selected
                                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                                    : 'border-gray-200 text-gray-700 hover:border-primary/50'
                                }`}
                              >
                                {type.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          선호 난이도
                        </label>
                        <div className="flex gap-2">
                          {(
                            [
                              { key: 'easy', label: '쉬움' },
                              { key: 'medium', label: '보통' },
                              { key: 'hard', label: '어려움' },
                            ] satisfies { key: Difficulty; label: string }[]
                          ).map((difficulty) => (
                            <button
                              key={difficulty.key}
                              onClick={() =>
                                setNewProfile({
                                  ...newProfile,
                                  preferences: {
                                    ...newProfile.preferences,
                                    preferredDifficulty: difficulty.key,
                                  },
                                })
                              }
                              className={`flex-1 rounded-xl border-2 px-3 py-2 text-sm transition shadow-sm ${
                                newProfile.preferences.preferredDifficulty === difficulty.key
                                  ? 'border-secondary bg-secondary/10 text-secondary font-semibold'
                                  : 'border-gray-200 text-gray-700 hover:border-secondary/50'
                              }`}
                            >
                              {difficulty.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          연령대 선택
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(
                            [
                              { key: 'kids', label: '어린이' },
                              { key: 'teens', label: '청소년' },
                              { key: 'family', label: '가족 전체' },
                            ] satisfies { key: AgeGroup; label: string }[]
                          ).map((group) => (
                            <button
                              key={group.key}
                              onClick={() =>
                                setNewProfile({
                                  ...newProfile,
                                  preferences: { ...newProfile.preferences, ageGroup: group.key },
                                })
                              }
                              className={`rounded-xl border-2 px-3 py-2 text-sm transition shadow-sm ${
                                newProfile.preferences.ageGroup === group.key
                                  ? 'border-emerald-400 bg-emerald-50 text-emerald-600 font-semibold'
                                  : 'border-gray-200 text-gray-700 hover:border-emerald-200'
                              }`}
                            >
                              {group.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="secondary"
                          size="medium"
                          fullWidth
                          onClick={() => setFormStep(1)}
                        >
                          이전
                        </Button>
                        <Button
                          variant="primary"
                          size="medium"
                          fullWidth
                          onClick={handleAddProfile}
                          disabled={!newProfile.preferences.favoriteTypes.length}
                        >
                          완료
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
