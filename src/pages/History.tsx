import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

interface HistoryItem {
  id: string;
  spread: string;
  spreadIcon: string;
  question: string;
  cardNames: string[];
  date: string;
  isPublic: boolean;
  likes: number;
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    spread: '凯尔特十字',
    spreadIcon: '☘️',
    question: '我的事业发展方向是什么？',
    cardNames: ['愚者', '女祭司', '皇帝', '命运之轮', '星星', '太阳', '世界', '权杖三', '圣杯六', '宝剑国王'],
    date: '2026-03-10 14:30',
    isPublic: true,
    likes: 12,
  },
  {
    id: '2',
    spread: '三牌阵',
    spreadIcon: '🔮',
    question: '这段感情的走向如何？',
    cardNames: ['恋人', '倒吊人', '星星'],
    date: '2026-03-09 20:15',
    isPublic: false,
    likes: 0,
  },
  {
    id: '3',
    spread: '单牌占卜',
    spreadIcon: '🎴',
    question: '今天我需要注意什么？',
    cardNames: ['力量'],
    date: '2026-03-09 09:00',
    isPublic: true,
    likes: 5,
  },
  {
    id: '4',
    spread: '每日一牌',
    spreadIcon: '☀️',
    question: '每日指引',
    cardNames: ['月亮'],
    date: '2026-03-08 08:00',
    isPublic: false,
    likes: 0,
  },
  {
    id: '5',
    spread: '三牌阵',
    spreadIcon: '🔮',
    question: '换工作是否明智？',
    cardNames: ['塔', '节制', '太阳'],
    date: '2026-03-07 16:45',
    isPublic: true,
    likes: 8,
  },
  {
    id: '6',
    spread: '每日一牌',
    spreadIcon: '☀️',
    question: '每日指引',
    cardNames: ['魔术师'],
    date: '2026-03-07 07:30',
    isPublic: false,
    likes: 0,
  },
];

export default function History() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-6">📜</div>
          <h2 className="text-2xl font-bold mb-3 text-gold-gradient">登录查看你的占卜历史</h2>
          <p className="text-text-secondary mb-6">
            登录后即可保存每一次占卜记录，随时回顾宇宙给你的指引。
          </p>
          <Link to="/auth/login">
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-accent-gold to-amber-600 text-bg-primary
                rounded-full font-bold text-lg hover:shadow-lg hover:shadow-accent-gold/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✨ 去登录
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            📜 <span className="text-gold-gradient">占卜历史</span>
          </h1>
          <p className="text-text-secondary">你的星语之旅，每一次对话都被记录</p>
        </motion.div>

        {/* Stats summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: '总占卜', value: mockHistory.length, icon: '🔮' },
            { label: '获得赞', value: mockHistory.reduce((a, h) => a + h.likes, 0), icon: '❤️' },
            { label: '公开分享', value: mockHistory.filter(h => h.isPublic).length, icon: '🌍' },
          ].map(stat => (
            <div
              key={stat.label}
              className="text-center p-4 bg-bg-secondary/50 border border-accent-purple/10 rounded-xl"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-accent-gold font-bold text-xl">{stat.value}</div>
              <div className="text-text-secondary/60 text-xs">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* History List */}
        <div className="space-y-4">
          {mockHistory.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-bg-secondary/40 border border-accent-purple/10 rounded-xl p-5
                hover:border-accent-gold/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.spreadIcon}</span>
                    <span className="text-accent-gold text-sm font-medium">{item.spread}</span>
                    {item.isPublic && (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] rounded-full">
                        公开
                      </span>
                    )}
                  </div>

                  <p className="text-text-primary text-sm mb-2">
                    {item.question}
                  </p>

                  {/* Card names */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.cardNames.map(name => (
                      <span
                        key={name}
                        className="px-2 py-0.5 bg-accent-purple/10 text-text-secondary text-xs rounded"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side */}
                <div className="text-right flex-shrink-0">
                  <div className="text-text-secondary/40 text-xs">{item.date}</div>
                  {item.likes > 0 && (
                    <div className="text-text-secondary/60 text-xs mt-1">
                      ❤️ {item.likes}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load more hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-text-secondary/40 text-sm mt-8"
        >
          — 共 {mockHistory.length} 条记录 —
        </motion.p>
      </div>
    </div>
  );
}
