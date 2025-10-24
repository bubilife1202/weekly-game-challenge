import { useProfileStore } from '../../store/profileStore';
import { soundManager } from '../../utils/sound';

export const ProfileSelector = () => {
  const { profiles, currentProfileId, setCurrentProfile } = useProfileStore();

  if (profiles.length === 0) return null;

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    soundManager.playClick();
    setCurrentProfile(e.target.value);
  };

  return (
    <div className="relative">
      <select
        value={currentProfileId || ''}
        onChange={handleProfileChange}
        className="appearance-none bg-white border-2 border-secondary rounded-xl px-4 py-2 pr-10 text-lg font-medium text-textDark cursor-pointer focus:outline-none focus:ring-2 focus:ring-secondary shadow-md"
      >
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.emoji} {profile.name}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary">
        ▼
      </div>
    </div>
  );
};
