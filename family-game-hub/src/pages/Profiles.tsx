import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../store/profileStore';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [newProfile, setNewProfile] = useState({
    name: '',
    emoji: availableEmojis[0],
    color: availableColors[0],
    age: undefined as number | undefined,
  });

  const handleAddProfile = () => {
    if (newProfile.name.trim()) {
      addProfile(newProfile);
      setNewProfile({
        name: '',
        emoji: availableEmojis[0],
        color: availableColors[0],
        age: undefined,
      });
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

                  {/* 이름 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      value={newProfile.name}
                      onChange={(e) =>
                        setNewProfile({ ...newProfile, name: e.target.value })
                      }
                      placeholder="이름을 입력하세요"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary focus:outline-none text-lg"
                      autoFocus
                    />
                  </div>

                  {/* 나이 (선택사항) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      나이 (선택사항)
                    </label>
                    <input
                      type="number"
                      value={newProfile.age || ''}
                      onChange={(e) =>
                        setNewProfile({
                          ...newProfile,
                          age: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="나이"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-primary focus:outline-none text-lg"
                    />
                  </div>

                  {/* 이모지 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      아이콘 선택
                    </label>
                    <div className="grid grid-cols-10 gap-2">
                      {availableEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() =>
                            setNewProfile({ ...newProfile, emoji })
                          }
                          className={`text-2xl p-2 rounded-lg transition-all ${
                            newProfile.emoji === emoji
                              ? 'bg-primary scale-110'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 색상 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      색상 선택
                    </label>
                    <div className="grid grid-cols-10 gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setNewProfile({ ...newProfile, color })
                          }
                          className={`w-10 h-10 rounded-full transition-all ${
                            newProfile.color === color
                              ? 'ring-4 ring-textDark scale-110'
                              : ''
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* 버튼 */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="secondary"
                      size="medium"
                      fullWidth
                      onClick={() => {
                        setShowAddForm(false);
                        setNewProfile({
                          name: '',
                          emoji: availableEmojis[0],
                          color: availableColors[0],
                          age: undefined,
                        });
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      size="medium"
                      fullWidth
                      onClick={handleAddProfile}
                      disabled={!newProfile.name.trim()}
                    >
                      추가
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
