import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { soundManager } from '../../utils/sound';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: ReactNode;
}

export const Header = ({ title, showBack = false, rightElement }: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    soundManager.playClick();
    navigate(-1);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showBack && (
            <button
              onClick={handleBack}
              className="text-2xl active:scale-90 transition-transform"
              aria-label="뒤로 가기"
            >
              ←
            </button>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-textDark truncate">
            {title}
          </h1>
        </div>
        {rightElement && <div className="flex-shrink-0">{rightElement}</div>}
      </div>
    </header>
  );
};
