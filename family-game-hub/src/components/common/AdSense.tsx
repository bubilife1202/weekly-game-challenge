import { useEffect } from 'react';

interface AdSenseProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  fullWidthResponsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdSense = ({
  adSlot = '0000000000', // 실제 광고 슬롯 ID로 교체 필요
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = '',
}: AdSenseProps) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle && import.meta.env.PROD) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // 개발 모드에서는 플레이스홀더 표시
  if (!import.meta.env.PROD) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm ${className}`}
        style={{ minHeight: '100px' }}
      >
        <div>📢 AdSense 광고 영역</div>
        <div className="text-xs mt-1">(프로덕션에서만 표시됩니다)</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8245597797545485"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};
