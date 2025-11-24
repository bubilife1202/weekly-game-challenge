import { motion } from 'framer-motion';

// Mock Data for demonstration since we don't have a real backend yet
const MOCK_RANKINGS = [
  { rank: 1, name: "DragonSlayer", score: 15400, game: "Snake" },
  { rank: 2, name: "MemoryKing", score: 12800, game: "Memory" },
  { rank: 3, name: "SpeedRunner", score: 10500, game: "Galaga" },
  { rank: 4, name: "EnglishMaster", score: 9800, game: "Words" },
  { rank: 5, name: "NewbieOne", score: 8200, game: "Snake" },
];

export const Leaderboard = () => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
        <h3 className="font-bold text-lg flex items-center gap-2">
          🏆 금주의 명예의 전당
        </h3>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Global Top 5</span>
      </div>

      <div className="divide-y divide-gray-100">
        {MOCK_RANKINGS.map((user, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center p-4 hover:bg-gray-50 transition-colors"
          >
            <div className={`
              w-8 h-8 flex items-center justify-center rounded-full font-bold mr-4 shrink-0
              ${index === 0 ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-400' :
                index === 1 ? 'bg-gray-100 text-gray-600 ring-2 ring-gray-400' :
                index === 2 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-400' :
                'bg-slate-100 text-slate-500'}
            `}>
              {user.rank}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-800 truncate">{user.name}</div>
              <div className="text-xs text-gray-500 truncate">{user.game} Champion</div>
            </div>

            <div className="font-mono font-bold text-indigo-600">
              {user.score.toLocaleString()}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 bg-gray-50 text-center text-xs text-gray-500 border-t border-gray-100">
        * 매주 월요일 00시 초기화
      </div>
    </div>
  );
};
