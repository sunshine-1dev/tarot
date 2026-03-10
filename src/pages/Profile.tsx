import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

// Mock stats
const mockStats = {
  totalReadings: 42,
  dailyStreak: 7,
  totalLikes: 86,
  favoriteSpread: '三牌阵',
  favoriteSuit: '圣杯',
  mostDrawnCard: '星星',
  memberSince: '2026-02-15',
  thisWeekReadings: 5,
  publicReadings: 18,
};

const recentActivity = [
  { type: 'reading', text: '进行了凯尔特十字占卜', time: '2 小时前', icon: '☘️' },
  { type: 'daily', text: '完成每日一牌签到', time: '今天 08:00', icon: '☀️' },
  { type: 'like', text: '获得了 3 个新赞', time: '昨天', icon: '❤️' },
  { type: 'reading', text: '进行了三牌阵占卜', time: '昨天', icon: '🔮' },
  { type: 'streak', text: '连续签到 7 天！', time: '昨天', icon: '🔥' },
];

const badges = [
  { icon: '🌟', name: '新星占卜师', desc: '完成首次占卜', earned: true },
  { icon: '🔥', name: '七日之约', desc: '连续签到 7 天', earned: true },
  { icon: '🏆', name: '百次占卜', desc: '累计占卜 100 次', earned: false },
  { icon: '☘️', name: '十字大师', desc: '完成 10 次凯尔特十字', earned: false },
  { icon: '❤️', name: '人气之星', desc: '获得 100 个赞', earned: false },
  { icon: '📚', name: '塔罗学者', desc: '查看所有 78 张牌', earned: false },
];

export default function Profile() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-6">👤</div>
          <h2 className="text-2xl font-bold mb-3 text-gold-gradient">登录查看你的主页</h2>
          <p className="text-text-secondary mb-6">
            创建账号后即可拥有个人主页、成就徽章和详细统计数据。
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
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-accent-gold/30 to-accent-purple/30
            rounded-full flex items-center justify-center text-4xl border-2 border-accent-gold/20 mb-4">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              '🔮'
            )}
          </div>

          <h1 className="text-2xl font-bold text-gold-gradient mb-1">{user.username}</h1>
          <p className="text-text-secondary text-sm">{user.email}</p>
          <p className="text-text-secondary/50 text-xs mt-1">
            加入于 {mockStats.memberSince}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: '总占卜', value: mockStats.totalReadings, icon: '🔮' },
            { label: '连续签到', value: `${mockStats.dailyStreak}天`, icon: '🔥' },
            { label: '获得赞', value: mockStats.totalLikes, icon: '❤️' },
            { label: '本周活跃', value: mockStats.thisWeekReadings, icon: '⚡' },
          ].map(stat => (
            <div
              key={stat.label}
              className="text-center p-4 bg-bg-secondary/50 border border-accent-purple/10 rounded-xl"
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className="text-accent-gold font-bold text-lg">{stat.value}</div>
              <div className="text-text-secondary/60 text-xs">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Favorite Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-bg-secondary/40 border border-accent-purple/10 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-text-primary mb-4">📊 占卜偏好</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-text-secondary/60 text-xs mb-1">最爱牌阵</div>
              <div className="text-text-primary text-sm font-medium">{mockStats.favoriteSpread}</div>
            </div>
            <div className="text-center">
              <div className="text-text-secondary/60 text-xs mb-1">最常出现</div>
              <div className="text-text-primary text-sm font-medium">{mockStats.mostDrawnCard}</div>
            </div>
            <div className="text-center">
              <div className="text-text-secondary/60 text-xs mb-1">亲近花色</div>
              <div className="text-text-primary text-sm font-medium">{mockStats.favoriteSuit}</div>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-text-primary mb-4">🏅 成就徽章</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {badges.map(badge => (
              <div
                key={badge.name}
                className={`text-center p-3 rounded-xl border transition-all ${
                  badge.earned
                    ? 'bg-accent-gold/10 border-accent-gold/20'
                    : 'bg-bg-secondary/30 border-accent-purple/5 opacity-40'
                }`}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-text-primary text-xs font-medium">{badge.name}</div>
                <div className="text-text-secondary/50 text-[10px] mt-0.5">{badge.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-lg font-bold text-text-primary mb-4">📋 最近动态</h2>
          <div className="bg-bg-secondary/40 border border-accent-purple/10 rounded-2xl overflow-hidden">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-5 py-3.5 ${
                  i < recentActivity.length - 1 ? 'border-b border-accent-purple/5' : ''
                }`}
              >
                <span className="text-lg">{activity.icon}</span>
                <span className="flex-1 text-text-primary text-sm">{activity.text}</span>
                <span className="text-text-secondary/50 text-xs">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center gap-4"
        >
          <Link to="/history">
            <motion.button
              className="px-6 py-2.5 border border-accent-purple/30 text-text-secondary
                rounded-full hover:text-text-primary hover:border-accent-gold/40 transition-all text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📜 查看历史
            </motion.button>
          </Link>
          <motion.button
            onClick={logout}
            className="px-6 py-2.5 border border-red-500/20 text-red-400/60
              rounded-full hover:text-red-400 hover:border-red-500/40 transition-all text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            退出登录
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
