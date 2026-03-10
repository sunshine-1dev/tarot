import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { fetchReadingHistory, type ReadingRecord } from '../lib/readings';

const spreadIcons: Record<string, string> = {
  single: '🎴',
  three_card: '🔮',
  celtic_cross: '☘️',
  daily: '☀️',
};

export default function History() {
  const { user } = useAuthStore();
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchReadingHistory(user.id).then(data => {
        setRecords(data);
        setIsLoading(false);
      });
    }
  }, [user]);

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
            { label: '总占卜', value: records.length, icon: '🔮' },
            { label: '本周', value: records.filter(r => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(r.created_at) > weekAgo;
            }).length, icon: '📅' },
            { label: '牌阵类型', value: new Set(records.map(r => r.spread_id)).size, icon: '🃏' },
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

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <motion.div
              className="text-4xl mb-4"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              🔮
            </motion.div>
            <p className="text-text-secondary">正在加载你的占卜记录...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && records.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-4">🌙</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">还没有占卜记录</h3>
            <p className="text-text-secondary mb-6">去抽一张牌，开始你的星语之旅吧！</p>
            <Link to="/reading">
              <motion.button
                className="px-6 py-2.5 bg-gradient-to-r from-accent-gold to-amber-600 text-bg-primary
                  rounded-full font-bold hover:shadow-lg hover:shadow-accent-gold/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔮 开始占卜
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* History List */}
        {!isLoading && records.length > 0 && (
          <div className="space-y-4">
            {records.map((record, i) => {
              const icon = spreadIcons[record.spread_id] || '🔮';
              const cardNames = Array.isArray(record.drawn_cards)
                ? record.drawn_cards.map(c => c.card_name_cn || c.card_name || '未知牌')
                : [];
              const date = new Date(record.created_at).toLocaleString('zh-CN', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-bg-secondary/40 border border-accent-purple/10 rounded-xl p-5
                    hover:border-accent-gold/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{icon}</span>
                        <span className="text-accent-gold text-sm font-medium">{record.spread_name}</span>
                      </div>

                      {record.question && (
                        <p className="text-text-primary text-sm mb-2">
                          {record.question}
                        </p>
                      )}

                      {/* Card names */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {cardNames.map((name, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-accent-purple/10 text-text-secondary text-xs rounded"
                          >
                            {name}
                          </span>
                        ))}
                      </div>

                      {/* Interpretation preview */}
                      {record.interpretation && (
                        <p className="text-text-secondary/60 text-xs line-clamp-2 mt-1">
                          {record.interpretation.slice(0, 120)}...
                        </p>
                      )}
                    </div>

                    {/* Right side */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-text-secondary/40 text-xs">{date}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Record count */}
        {!isLoading && records.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-text-secondary/40 text-sm mt-8"
          >
            — 共 {records.length} 条记录 —
          </motion.p>
        )}
      </div>
    </div>
  );
}
