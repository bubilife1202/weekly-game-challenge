import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { soundManager } from '../../utils/sound';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  onClick,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses =
    'font-bold rounded-xl transition-all duration-200 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary/90 text-white',
    secondary: 'bg-secondary hover:bg-secondary/90 text-white',
    success: 'bg-success hover:bg-success/90 text-textDark',
    warning: 'bg-warning hover:bg-warning/90 text-textDark',
  };

  const sizeClasses = {
    small: 'px-4 py-2 text-sm min-h-[40px]',
    medium: 'px-6 py-3 text-base min-h-[48px]',
    large: 'px-8 py-4 text-lg min-h-[60px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundManager.playClick();
    onClick?.(e);
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
