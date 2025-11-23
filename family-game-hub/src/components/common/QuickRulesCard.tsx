import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button';

interface QuickRulesCardProps {
  title: string;
  subtitle?: string;
  rules: string[];
  tips?: string[];
  playCount: number;
  autoCollapseAfterMs?: number;
  accentEmoji?: string;
}

export const QuickRulesCard = ({
  title,
  subtitle,
  rules,
  tips = [],
  playCount,
  autoCollapseAfterMs = 15000,
  accentEmoji = '⚡',
}: QuickRulesCardProps) => {
  const [collapsed, setCollapsed] = useState(playCount >= 2);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (playCount < 2) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  }, [playCount]);

  useEffect(() => {
    if (collapsed) return;

    const startedAt = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const newProgress = Math.max(0, 100 - (elapsed / autoCollapseAfterMs) * 100);
      setProgress(newProgress);

      if (elapsed >= autoCollapseAfterMs) {
        setCollapsed(true);
      }
    }, 200);

    return () => clearInterval(timer);
  }, [collapsed, autoCollapseAfterMs]);

  return (
    <div className="relative">
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            className="bg-white/90 backdrop-blur-md border border-primary/20 rounded-2xl p-4 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl" aria-hidden>
                {accentEmoji}
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-lg font-bold text-textDark">{title}</h3>
                  {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
                </div>
                <ul className="text-sm text-gray-800 space-y-1 list-disc list-inside">
                  {rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
                {tips.length > 0 && (
                  <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-sm text-primary">
                    <div className="font-semibold mb-1">꿀팁</div>
                    <ul className="list-disc list-inside space-y-1">
                      {tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                      aria-hidden
                    />
                  </div>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => setCollapsed(true)}
                    animated
                    className="!py-1"
                  >
                    바로 시작
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {collapsed && (
          <motion.button
            key="collapsed"
            type="button"
            onClick={() => setCollapsed(false)}
            className="mt-2 inline-flex items-center gap-2 bg-primary/10 text-primary font-semibold px-3 py-2 rounded-full shadow-sm hover:bg-primary/20 transition"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <span>{accentEmoji}</span>
            <span className="text-sm">빠른 규칙 다시 보기</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
