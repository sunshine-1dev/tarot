import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { supabase } from '../lib/supabase';

interface UserStats {
  totalReadings: number;
  dailyStreak: number;
  thisWeekReadings: number;
  memberSince: string;
  favoriteSpread: string;
  recentActivity: { type: string; text: string; time: string; icon: string }[];
}

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadStats();
    else setLoading(false);
  }, [user]);

  async function loadStats() {
    try {
      // 总占卜次数
      const { count: totalReadings } = await supabase
        .from('reading_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id);

      // 本周占卜
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: thisWeekReadings } = await supabase
        .from('reading_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .gte('created_at', weekAgo.toISOString());

      // 每日签到连续天数
      const { data: dailyData } = await supabase
        .from('daily_readings')
        .select('reading_date')
        .eq('user_id', user!.id)
        .order('reading_date', { ascending: false })
        .limit(365);

      let streak = 0;
      if (dailyData && dailyData.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const dates = dailyData.map(d => d.reading_date);
        let checkDate = today;
        // 如果今天没签到，从昨天开始算
        if (!dates.includes(today)) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          checkDate = yesterday.toISOString().split('T')[0];
        }
        for (const date of dates) {
          if (date === checkDate) {
            streak++;
            const prev = new Date(checkDate);
            prev.setDate(prev.getDate() - 1);
            checkDate = prev.toISOString().split('T')[0];
          } else if (date < checkDate) {
            break;
          }
        }
      }

      // 最常用牌阵
      const { data: spreadData } = await supabase
        .from('reading_records')
        .select('spread_name')
        .eq('user_id', user!.id);
      
      let favoriteSpread = '暂无';
      if (spreadData && spreadData.length > 0) {
        const counts: Record<string, number> = {};
        spreadData.forEach(r => {
          counts[r.spread_name] = (counts[r.spread_name] || 0) + 1;
        });
        favoriteSpread = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      }

      // 最近活动
      const { data: recentData } = await supabase
        .from('reading_records')
        .select('spread_name, created_at, question')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const recentActivity = (recentData || []).map(r => {
        const time = getRelativeTime(r.created_at);
        return {
          type: 'reading',
          text: r.question ? `「${r.question.slice(0, 20)}」${r.spread_name}` : `进行了${r.spread_name}占卜`,
          time,
          icon: r.spread_name.includes('每日') ? '☀️' : r.spread_name.includes('凯尔特') ? '☘️' : '🔮',
        };
      });

      const memberSince = user!.created_at || '未知';

      setStats({
        totalReadings: totalReadings || 0,
        dailyStreak: streak,
        thisWeekReadings: thisWeekReadings || 0,
        memberSince,
        favoriteSpread,
        recentActivity,
      });
    } catch (e) {
      console.error('Failed to load stats:', e);
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔐</div>
          <h2 className="text-xl font-semibold text-text-primary">请先登录</h2>
          <Link to="/auth/login">
            <button className="px-6 py-2 bg-accent-gold/20 text-accent-gold rounded-lg hover:bg-accent-gold/30 transition-colors">
              前往登录
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-mystic-purple/30 to-deep-blue/30 border border-white/10 p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-gold to-mystic-purple flex items-center justify-center text-3xl">
              {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '🌟'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                {user.username || user.email?.split('@')[0] || '神秘占卜师'}
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                {user.email}
              </p>
              {stats && (
                <p className="text-text-secondary/60 text-xs mt-1">
                  加入于 {stats.memberSince}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-8 text-text-secondary">加载中...</div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: '总占卜', value: stats.totalReadings, icon: '🔮' },
                { label: '连续签到', value: `${stats.dailyStreak}天`, icon: '🔥' },
                { label: '本周活跃', value: stats.thisWeekReadings, icon: '⚡' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl bg-white/5 border border-white/10 p-4 text-center"
                >
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-bold text-text-primary">{stat.value}</div>
                  <div className="text-xs text-text-secondary mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Insights */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
              <h3 className="text-sm font-medium text-text-secondary">📊 占卜偏好</h3>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary text-sm">最常用牌阵</span>
                <span className="text-text-primary text-sm font-medium">{stats.favoriteSpread}</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
              <h3 className="text-sm font-medium text-text-secondary">📜 最近活动</h3>
              {stats.recentActivity.length === 0 ? (
                <p className="text-text-secondary/60 text-sm text-center py-4">
                  还没有占卜记录，去试试吧！
                </p>
              ) : (
                stats.recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <span className="text-lg">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm text-text-primary">{activity.text}</p>
                      <p className="text-xs text-text-secondary/60">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Links */}
            <div className="space-y-3">
              <Link to="/history">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <span className="text-text-primary">📜 占卜历史</span>
                  <span className="text-text-secondary">→</span>
                </div>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-text-secondary">加载失败</div>
        )}

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
        >
          退出登录
        </button>
      </div>
    </div>
  );
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString('zh-CN');
}
