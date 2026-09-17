import React from 'react';

interface NabdLogoProps {
  variant?: 'full' | 'icon' | 'badge';
  theme?: 'dark' | 'light' | 'original';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const NabdLogo: React.FC<NabdLogoProps> = ({
  variant = 'full',
  theme = 'original',
  size = 'md',
  className = '',
  showSubtitle = false,
}) => {
  // Brand color constants
  const brandBlue = '#1b24f5';
  const brandLime = '#b5f812';

  const iconSizes = {
    sm: 'h-7 w-7 rounded-lg',
    md: 'h-9 w-9 rounded-xl',
    lg: 'h-12 w-12 rounded-2xl',
    xl: 'h-16 w-16 rounded-3xl',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const renderIconBox = () => (
    <div
      className={`relative flex items-center justify-center shrink-0 shadow-xs transition-transform ${iconSizes[size]}`}
      style={{ backgroundColor: brandLime }}
    >
      {/* SVG Pulse & Arrow matching the exact logo */}
      <svg
        viewBox="0 0 100 100"
        className="w-[85%] h-[85%]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Arrow Chevron pointing right: reach / وصول */}
        <path
          d="M 16 35 L 36 50 L 16 65 L 8 57 L 22 50 L 8 43 Z"
          fill={brandBlue}
        />
        {/* Notch connector */}
        <path
          d="M 38 50 L 44 47 L 44 53 Z"
          fill={brandBlue}
        />
        {/* Pulse ECG wave: نبض */}
        <path
          d="M 48 50 L 55 50 L 63 18 L 73 82 L 81 50 L 100 50"
          stroke={brandBlue}
          strokeWidth="9"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{renderIconBox()}</div>;
  }

  const isLightText = theme === 'original' || theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {renderIconBox()}
      <div className="flex flex-col leading-tight select-none">
        <div className="flex items-center gap-1 font-extrabold tracking-tight">
          <span
            className={`${textSizes[size]} font-black ${
              isLightText ? 'text-white' : 'text-[#1b24f5]'
            }`}
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            نبض الوصول
          </span>
          <span
            className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: isLightText ? brandLime : '#1b24f5',
              color: isLightText ? '#1b24f5' : '#ffffff',
            }}
          >
            AGENCY
          </span>
        </div>
        {showSubtitle && (
          <p
            className={`text-[10px] font-medium ${
              isLightText ? 'text-blue-100' : 'text-slate-500'
            }`}
          >
            وكالة نبض الوصول للتسويق الرقمي
          </p>
        )}
      </div>
    </div>
  );
};
