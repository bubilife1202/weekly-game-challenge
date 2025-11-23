import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  FamilyMission,
  MissionCategory,
  Profile,
  ProfileBadge,
} from '../types';

interface ProfileState {
  profiles: Profile[];
  currentProfileId: string | null;
  addProfile: (profile: Omit<Profile, 'id' | 'createdAt'>) => void;
  updateProfile: (id: string, profile: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  setCurrentProfile: (id: string) => void;
  getCurrentProfile: () => Profile | null;
  ensureWeeklyMissions: (id: string) => void;
  completeMission: (profileId: string, missionId: string) => void;
}

const MISSION_CATEGORIES: MissionCategory[] = [
  'cooperative',
  'competitive',
  'learning',
];

const missionTemplates: Record<MissionCategory, { title: string; description: string }[]> = {
  cooperative: [
    {
      title: '함께 협동 클리어',
      description: '가족이 함께 카드 뒤집기나 미로 찾기를 협력해서 완료하세요.',
    },
    {
      title: '팀워크 타임',
      description: '두 명 이상이 번갈아가며 스도쿠 또는 2048 점수 기록 세우기.',
    },
  ],
  competitive: [
    {
      title: '가족 챔피언전',
      description: '갤러그나 벽돌깨기에서 가족 랭킹 1위 도전!',
    },
    {
      title: '스피드러너',
      description: '스네이크 혹은 미로 찾기에서 가장 빠른 기록 세우기.',
    },
  ],
  learning: [
    {
      title: '학습 챌린지',
      description: '영어 단어/문장 또는 세계 지도 퀴즈에서 3라운드 연속 플레이.',
    },
    {
      title: '지식 탐험가',
      description: '학습 게임 중 하나에서 정확도 80% 이상 달성하기.',
    },
  ],
};

const createBadge = (category: MissionCategory): ProfileBadge => ({
  id: `family_${category}`,
  name: category === 'cooperative'
    ? '함께한 가족'
    : category === 'competitive'
      ? '열정 가득'
      : '호기심 천국',
  description:
    category === 'cooperative'
      ? '협동 미션을 완수했어요'
      : category === 'competitive'
        ? '경쟁 미션을 완수했어요'
        : '학습 미션을 완수했어요',
  emoji:
    category === 'cooperative'
      ? '🤝'
      : category === 'competitive'
        ? '🏁'
        : '📚',
  earnedAt: Date.now(),
});

const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
};

const createMission = (category: MissionCategory): FamilyMission => {
  const templateOptions = missionTemplates[category];
  const template =
    templateOptions[Math.floor(Math.random() * templateOptions.length)];

  return {
    id: crypto.randomUUID(),
    category,
    title: template.title,
    description: template.description,
    rewardBadge: createBadge(category),
    completed: false,
    generatedAt: Date.now(),
  };
};

const generateWeeklyMissions = (): FamilyMission[] =>
  MISSION_CATEGORIES.map((category) => createMission(category));

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      currentProfileId: null,

      addProfile: (profile) => {
        const newProfile: Profile = {
          ...profile,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          badges: [],
          missions: generateWeeklyMissions(),
          lastMissionGeneratedAt: getWeekStart(),
        };
        set((state) => ({
          profiles: [...state.profiles, newProfile],
          currentProfileId: newProfile.id,
        }));
      },

      updateProfile: (id, profile) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id ? { ...p, ...profile } : p
          ),
        }));
      },

      deleteProfile: (id) => {
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          currentProfileId:
            state.currentProfileId === id ? null : state.currentProfileId,
        }));
      },

      setCurrentProfile: (id) => {
        set({ currentProfileId: id });
      },

      getCurrentProfile: () => {
        const { profiles, currentProfileId } = get();
        return profiles.find((p) => p.id === currentProfileId) || null;
      },

      ensureWeeklyMissions: (id) => {
        set((state) => ({
          profiles: state.profiles.map((profile) => {
            if (profile.id !== id) return profile;

            const lastWeekStart = profile.lastMissionGeneratedAt;
            const currentWeekStart = getWeekStart();

            if (lastWeekStart && lastWeekStart === currentWeekStart) {
              return profile;
            }

            return {
              ...profile,
              missions: generateWeeklyMissions(),
              lastMissionGeneratedAt: currentWeekStart,
            };
          }),
        }));
      },

      completeMission: (profileId, missionId) => {
        set((state) => ({
          profiles: state.profiles.map((profile) => {
            if (profile.id !== profileId || !profile.missions) return profile;

            const missions = profile.missions.map((mission) =>
              mission.id === missionId ? { ...mission, completed: true } : mission
            );

            const mission = missions.find((m) => m.id === missionId);
            const hasBadge = profile.badges?.some(
              (badge) => badge.id === mission?.rewardBadge.id
            );

            return {
              ...profile,
              missions,
              badges:
                mission && !hasBadge
                  ? [...(profile.badges || []), { ...mission.rewardBadge, earnedAt: Date.now() }]
                  : profile.badges,
            };
          }),
        }));
      },
    }),
    {
      name: 'family-game-profiles',
    }
  )
);
