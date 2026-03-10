import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '🎴',
    title: '单牌占卜',
    desc: '抽取一张牌，获得当下最需要的启示',
    path: '/reading/single',
    color: 'from-accent-gold/20 to-accent-purple/20',
  },
  {
    icon: '🔮',
    title: '三牌阵',
    desc: '过去、现在、未来——时间之河的三个节点',
    path: '/reading/three-card',
    color: 'from-accent-purple/20 to-border-glow/20',
  },
  {
    icon: '☘️',
    title: '凯尔特十字',
    desc: '最经典的十牌阵，全面深入揭示你的处境',
    path: '/reading/celtic-cross',
    color: 'from-green-500/20 to-accent-purple/20',
  },
  {
    icon: '☀️',
    title: '每日一牌',
    desc: '每天清晨，让一张牌为你的一天定调',
    path: '/daily',
    color: 'from-amber-500/20 to-accent-gold/20',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
        {/* Decorative circles */}
        <div className="absolute w-72 h-72 bg-accent-purple/10 rounded-full blur-3xl top-1/4 -left-20" />
        <div className="absolute w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl top-1/3 -right-32" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <motion.div
            className="text-7xl md:text-8xl mb-6"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            🔮
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-gold-gradient">星语塔罗</span>
          </h1>

          <p className="text-text-secondary text-lg md:text-xl max-w-xl mx-auto mb-2">
            Stellar Tarot
          </p>

          <p className="text-text-secondary/70 text-base md:text-lg max-w-2xl mx-auto mb-12">
            在星光的指引下，倾听宇宙的低语<br />
            78 张塔罗牌，为你揭示命运的密码
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reading">
              <motion.button
                className="px-8 py-3.5 bg-gradient-to-r from-accent-gold to-amber-600 text-bg-primary 
                  rounded-full font-bold text-lg hover:shadow-lg hover:shadow-accent-gold/20 
                  transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✨ 开始占卜
              </motion.button>
            </Link>
            <Link to="/daily">
              <motion.button
                className="px-8 py-3.5 border-2 border-accent-purple/50 text-text-primary 
                  rounded-full font-medium text-lg hover:bg-accent-purple/10 
                  transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ☀️ 每日一牌
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg className="w-6 h-6 text-text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.h2
          className="text-center text-2xl md:text-3xl font-bold mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          选择你的 <span className="text-gold-gradient">占卜方式</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.path}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={feature.path}>
                <div className={`group relative p-6 rounded-2xl border border-accent-purple/20 
                  bg-gradient-to-br ${feature.color} backdrop-blur-sm
                  hover:border-accent-gold/40 transition-all duration-300 hover:-translate-y-1 h-full`}
                >
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-text-primary mb-1.5 group-hover:text-accent-gold transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-3 text-accent-gold/60 text-sm group-hover:text-accent-gold transition-colors">
                    开始占卜 →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/leaderboard">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-accent-purple/10 bg-bg-secondary/30
                hover:border-accent-gold/30 transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-lg font-bold text-text-primary mb-1">排行榜</h3>
              <p className="text-text-secondary text-sm">查看社区顶尖占卜师排名</p>
            </motion.div>
          </Link>
          <Link to="/history">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border border-accent-purple/10 bg-bg-secondary/30
                hover:border-accent-gold/30 transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-3xl mb-2">📜</div>
              <h3 className="text-lg font-bold text-text-primary mb-1">占卜历史</h3>
              <p className="text-text-secondary text-sm">回顾你的每一次占卜记录</p>
            </motion.div>
          </Link>
          <Link to="/profile">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-accent-purple/10 bg-bg-secondary/30
                hover:border-accent-gold/30 transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-3xl mb-2">👤</div>
              <h3 className="text-lg font-bold text-text-primary mb-1">个人主页</h3>
              <p className="text-text-secondary text-sm">成就徽章与数据统计</p>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 md:p-12 rounded-2xl border border-accent-purple/10 bg-bg-secondary/50"
        >
          <h2 className="text-2xl font-bold mb-4 text-gold-gradient">关于塔罗牌</h2>
          <p className="text-text-secondary leading-relaxed">
            塔罗牌是一套由 78 张牌组成的占卜工具，分为 22 张大阿卡纳和 56 张小阿卡纳。
            它不是预测未来的工具，而是帮助你连接内心智慧、理清思路的镜子。
            每张牌都蕴含着丰富的象征意义，当你带着真诚的心提出问题，
            牌面上的图像与符号会像一面镜子，映照出你内心深处的答案。
          </p>
        </motion.div>
      </section>
    </div>
  );
}
