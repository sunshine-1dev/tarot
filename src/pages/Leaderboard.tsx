import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  value: number;
  label: string;
}

const tabs = [
  { id: 'master', label: '🔮 占卜达人', desc: '累计占卜次数最多' },
  { id: 'streak', label: '🔥 坚持之星', desc: '每日一牌连续签到天数' },
  { id: 'weekly', label: '⚡ 本周活跃', desc: '本周占卜次数排行' },
];

function getRankStyle(rank: number): string {
  if (rank === 1) return 'text-yellow-400';
  if (rank === 2) return 'text-gray-300';
  if (rank === 3) return 'text-amber-600';
  return 'text-text-secondary';
}

function getRankIcon(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}`;
}

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState('master');
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard(activeTab);
  }, [activeTab]);

  async function loadLeaderboard(tab: string) {
    setLoading(true);
    try {
      let entries: LeaderboardEntry[] = [];

      if (tab === 'master') {
        // 累计占卜次数 — 按 user_id 分组统计
        const { data: records } = await supabase
          .from('reading_records')
          .select('user_id');

        if (records && records.length > 0) {
          const counts: Record<string, number> = {};
          records.forEach(r => {
            counts[r.user_id] = (counts[r.user_id] || 0) + 1;
          });

          const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

          // 获取用户信息
          const userIds = sorted.map(s => s[0]);
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url')
            .in('id', userIds);

          const profileMap: Record<string, any> = {};
          (profiles || []).forEach(p => { profileMap[p.id] = p; });

          entries = sorted.map(([uid, count], i) => ({
            rank: i + 1,
            username: profileMap[uid]?.full_name || profileMap[uid]?.email?.split('@')[0] || '神秘占卜师',
            avatar: getAvatar(profileMap[uid]?.full_name || '', i),
            value: count,
            label: '次占卜',
          }));
        }
      } else if (tab === 'streak') {
        // 连续签到天数
        const { data: allDaily } = await supabase
          .from('daily_readings')
          .select('user_id, reading_date')
          .order('reading_date', { ascending: false });

        if (allDaily && allDaily.length > 0) {
          // 按用户分组
          const userDates: Record<string, string[]> = {};
          allDaily.forEach(d => {
            if (!userDates[d.user_id]) userDates[d.user_id] = [];
            userDates[d.user_id].push(d.reading_date);
          });

          const streaks: { uid: string; streak: number }[] = [];
          for (const [uid, dates] of Object.entries(userDates)) {
            let streak = 0;
            const today = new Date().toISOString().split('T')[0];
            let checkDate = today;
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
            if (streak > 0) streaks.push({ uid, streak });
          }

          const sorted = streaks.sort((a, b) => b.streak - a.streak).slice(0, 10);
          const userIds = sorted.map(s => s.uid);
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);

          const profileMap: Record<string, any> = {};
          (profiles || []).forEach(p => { profileMap[p.id] = p; });

          entries = sorted.map((s, i) => ({
            rank: i + 1,
            username: profileMap[s.uid]?.full_name || profileMap[s.uid]?.email?.split('@')[0] || '神秘占卜师',
            avatar: getAvatar(profileMap[s.uid]?.full_name || '', i),
            value: s.streak,
            label: '天连续',
          }));
        }
      } else if (tab === 'weekly') {
        // 本周占卜次数
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const { data: records } = await supabase
          .from('reading_records')
          .select('user_id')
          .gte('created_at', weekAgo.toISOString());

        if (records && records.length > 0) {
          const counts: Record<string, number> = {};
          records.forEach(r => {
            counts[r.user_id] = (counts[r.user_id] || 0) + 1;
          });

          const sorted = Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

          const userIds = sorted.map(s => s[0]);
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);

          const profileMap: Record<string, any> = {};
          (profiles || []).forEach(p => { profileMap[p.id] = p; });

          entries = sorted.map(([uid, count], i) => ({
            rank: i + 1,
            username: profileMap[uid]?.full_name || profileMap[uid]?.email?.split('@')[0] || '神秘占卜师',
            avatar: getAvatar(profileMap[uid]?.full_name || '', i),
            value: count,
            label: '次本周',
          }));
        }
      }

      setData(entries);
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">🏆 排行榜</h1>
          <p className="text-text-secondary">与其他占卜师一较高下</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <p className="text-text-secondary/60 text-sm text-center mb-4">
          {tabs.find(t => t.id === activeTab)?.desc}
        </p>

        {/* Leaderboard List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-2"
          >
            {loading ? (
              <div className="text-center py-12 text-text-secondary">加载中...</div>
            ) : data.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🌟</div>
                <p className="text-text-secondary">还没有人上榜</p>
                <p className="text-text-secondary/60 text-sm mt-1">快去占卜，成为第一名！</p>
              </div>
            ) : (
              data.map((entry, i) => (
                <motion.div
                  key={`${activeTab}-${entry.rank}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                    entry.rank <= 3
                      ? 'bg-gradient-to-r from-accent-gold/10 to-transparent border-accent-gold/20'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className={`text-xl font-bold w-8 text-center ${getRankStyle(entry.rank)}`}>
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="text-2xl">{entry.avatar}</div>
                  <div className="flex-1">
                    <div className="text-text-primary font-medium">{entry.username}</div>
                    <div className="text-text-secondary text-sm">
                      {entry.value} {entry.label}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const avatarEmojis = ['🌟', '🌙', '💎', '🐱', '🧙', '⭐', '🎡', '🌌', '🌅', '🌆'];
function getAvatar(name: string, index: number): string {
  if (name) {
    const code = name.charCodeAt(0);
    return avatarEmojis[code % avatarEmojis.length];
  }
  return avatarEmojis[index % avatarEmojis.length];
}
