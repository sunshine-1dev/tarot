import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const spreadOptions = [
  {
    icon: '🎴',
    title: '单牌占卜',
    desc: '抽取一张牌，获得当下最需要的启示。适合快速提问，简洁明了。',
    path: '/reading/single',
    color: 'from-accent-gold/20 to-accent-purple/20',
    cardCount: 1,
    duration: '1-2 分钟',
  },
  {
    icon: '🔮',
    title: '三牌阵',
    desc: '过去、现在、未来——时间之河的三个节点，揭示事物发展脉络。',
    path: '/reading/three-card',
    color: 'from-accent-purple/20 to-border-glow/20',
    cardCount: 3,
    duration: '3-5 分钟',
  },
  {
    icon: '☘️',
    title: '凯尔特十字',
    desc: '最经典的十牌阵，全面深入地揭示你的处境、障碍、潜力与最终结果。',
    path: '/reading/celtic-cross',
    color: 'from-green-500/20 to-accent-purple/20',
    cardCount: 10,
    duration: '8-12 分钟',
  },
  {
    icon: '☀️',
    title: '每日一牌',
    desc: '每天清晨，让一张牌为你的一天定调。简单而有力的日常指引。',
    path: '/daily',
    color: 'from-amber-500/20 to-accent-gold/20',
    cardCount: 1,
    duration: '1 分钟',
  },
];

export default function ReadingSelect() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gold-gradient">选择牌阵</span>
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto">
            每种牌阵都有其独特的视角和深度。选择最适合你当前问题的牌阵。
          </p>
        </motion.div>

        {/* Spread Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spreadOptions.map((spread, i) => (
            <motion.div
              key={spread.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={spread.path}>
                <div className={`group relative p-6 md:p-8 rounded-2xl border border-accent-purple/20
                  bg-gradient-to-br ${spread.color} backdrop-blur-sm
                  hover:border-accent-gold/40 transition-all duration-300 hover:-translate-y-1
                  hover:shadow-lg hover:shadow-accent-gold/5 h-full`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl md:text-5xl flex-shrink-0">{spread.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent-gold transition-colors">
                        {spread.title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        {spread.desc}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center gap-4 text-xs text-text-secondary/60">
                        <span className="flex items-center gap-1">
                          <span>🃏</span> {spread.cardCount} 张牌
                        </span>
                        <span className="flex items-center gap-1">
                          <span>⏱️</span> {spread.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-6 right-6 text-accent-gold/40 group-hover:text-accent-gold
                    group-hover:translate-x-1 transition-all">
                    →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-text-secondary/50 text-sm">
            💡 不确定选哪个？初次使用推荐「单牌占卜」，想深入了解选「凯尔特十字」
          </p>
        </motion.div>
      </div>
    </div>
  );
}
