import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  { id: 'popular', label: '❤️ 最受欢迎', desc: '获赞最多的占卜师' },
  { id: 'weekly', label: '⚡ 本周活跃', desc: '本周占卜次数排行' },
];

const mockData: Record<string, LeaderboardEntry[]> = {
  master: [
    { rank: 1, username: '星辰占师', avatar: '🌟', value: 487, label: '次占卜' },
    { rank: 2, username: '月夜行者', avatar: '🌙', value: 356, label: '次占卜' },
    { rank: 3, username: '紫水晶心', avatar: '💎', value: 298, label: '次占卜' },
    { rank: 4, username: '塔罗猫猫', avatar: '🐱', value: 245, label: '次占卜' },
    { rank: 5, username: '神秘旅人', avatar: '🧙', value: 201, label: '次占卜' },
    { rank: 6, username: '占星小白', avatar: '⭐', value: 187, label: '次占卜' },
    { rank: 7, username: '命运之轮', avatar: '🎡', value: 156, label: '次占卜' },
    { rank: 8, username: '银河低语', avatar: '🌌', value: 134, label: '次占卜' },
    { rank: 9, username: '晨曦之光', avatar: '🌅', value: 112, label: '次占卜' },
    { rank: 10, username: '暮色占卜', avatar: '🌆', value: 98, label: '次占卜' },
  ],
  streak: [
    { rank: 1, username: '日月如梭', avatar: '☀️', value: 128, label: '天连续' },
    { rank: 2, username: '星辰占师', avatar: '🌟', value: 97, label: '天连续' },
    { rank: 3, username: '坚持达人', avatar: '💪', value: 85, label: '天连续' },
    { rank: 4, username: '每日冥想', avatar: '🧘', value: 72, label: '天连续' },
    { rank: 5, username: '塔罗猫猫', avatar: '🐱', value: 63, label: '天连续' },
    { rank: 6, username: '晨光使者', avatar: '🌄', value: 51, label: '天连续' },
    { rank: 7, username: '紫水晶心', avatar: '💎', value: 44, label: '天连续' },
    { rank: 8, username: '星空守望', avatar: '🔭', value: 38, label: '天连续' },
    { rank: 9, username: '月夜行者', avatar: '🌙', value: 31, label: '天连续' },
    { rank: 10, username: '探索者X', avatar: '🗺️', value: 25, label: '天连续' },
  ],
  popular: [
    { rank: 1, username: '塔罗猫猫', avatar: '🐱', value: 1203, label: '个赞' },
    { rank: 2, username: '星辰占师', avatar: '🌟', value: 986, label: '个赞' },
    { rank: 3, username: '月夜行者', avatar: '🌙', value: 754, label: '个赞' },
    { rank: 4, username: '神秘旅人', avatar: '🧙', value: 621, label: '个赞' },
    { rank: 5, username: '紫水晶心', avatar: '💎', value: 543, label: '个赞' },
    { rank: 6, username: '银河低语', avatar: '🌌', value: 432, label: '个赞' },
    { rank: 7, username: '占星小白', avatar: '⭐', value: 387, label: '个赞' },
    { rank: 8, username: '命运之轮', avatar: '🎡', value: 321, label: '个赞' },
    { rank: 9, username: '日月如梭', avatar: '☀️', value: 276, label: '个赞' },
    { rank: 10, username: '暮色占卜', avatar: '🌆', value: 198, label: '个赞' },
  ],
  weekly: [
    { rank: 1, username: '命运之轮', avatar: '🎡', value: 23, label: '次本周' },
    { rank: 2, username: '塔罗猫猫', avatar: '🐱', value: 19, label: '次本周' },
    { rank: 3, username: '新手小明', avatar: '😊', value: 17, label: '次本周' },
    { rank: 4, username: '星辰占师', avatar: '🌟', value: 15, label: '次本周' },
    { rank: 5, username: '好奇宝宝', avatar: '🤔', value: 14, label: '次本周' },
    { rank: 6, username: '月夜行者', avatar: '🌙', value: 12, label: '次本周' },
    { rank: 7, username: '暮色占卜', avatar: '🌆', value: 10, label: '次本周' },
    { rank: 8, username: '紫水晶心', avatar: '💎', value: 9, label: '次本周' },
    { rank: 9, username: '占星小白', avatar: '⭐', value: 8, label: '次本周' },
    { rank: 10, username: '日月如梭', avatar: '☀️', value: 7, label: '次本周' },
  ],
};

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

  const currentTab = tabs.find(t => t.id === activeTab)!;
  const data = mockData[activeTab] || [];

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
            🏆 <span className="text-gold-gradient">排行榜</span>
          </h1>
          <p className="text-text-secondary">星语塔罗社区的顶尖占卜师</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30'
                  : 'bg-bg-secondary/50 text-text-secondary border border-accent-purple/10 hover:border-accent-purple/30 hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab description */}
        <motion.p
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-text-secondary/60 text-sm mb-6"
        >
          {currentTab.desc}
        </motion.p>

        {/* Top 3 Podium */}
        <motion.div
          key={`podium-${activeTab}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-end gap-4 mb-8"
        >
          {/* 2nd place */}
          {data[1] && (
            <div className="text-center">
              <div className="text-3xl mb-1">{data[1].avatar}</div>
              <div className="text-text-primary text-sm font-medium">{data[1].username}</div>
              <div className="text-gray-300 text-xs">{data[1].value} {data[1].label}</div>
              <div className="mt-2 w-20 h-16 bg-gradient-to-t from-gray-600/20 to-gray-400/20 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl">🥈</span>
              </div>
            </div>
          )}

          {/* 1st place */}
          {data[0] && (
            <div className="text-center">
              <motion.div
                className="text-4xl mb-1"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {data[0].avatar}
              </motion.div>
              <div className="text-accent-gold text-sm font-bold">{data[0].username}</div>
              <div className="text-accent-gold/70 text-xs">{data[0].value} {data[0].label}</div>
              <div className="mt-2 w-20 h-24 bg-gradient-to-t from-accent-gold/20 to-accent-gold/10 rounded-t-lg flex items-center justify-center border-t-2 border-accent-gold/30">
                <span className="text-3xl">🥇</span>
              </div>
            </div>
          )}

          {/* 3rd place */}
          {data[2] && (
            <div className="text-center">
              <div className="text-3xl mb-1">{data[2].avatar}</div>
              <div className="text-text-primary text-sm font-medium">{data[2].username}</div>
              <div className="text-amber-600/70 text-xs">{data[2].value} {data[2].label}</div>
              <div className="mt-2 w-20 h-12 bg-gradient-to-t from-amber-800/20 to-amber-600/20 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl">🥉</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Full List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-bg-secondary/40 border border-accent-purple/10 rounded-2xl overflow-hidden"
          >
            {data.map((entry, i) => (
              <motion.div
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 px-6 py-4 ${
                  i < data.length - 1 ? 'border-b border-accent-purple/5' : ''
                } ${i < 3 ? 'bg-accent-gold/5' : ''}`}
              >
                {/* Rank */}
                <div className={`w-8 text-center font-bold ${getRankStyle(entry.rank)}`}>
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <div className="text-2xl">{entry.avatar}</div>

                {/* Name */}
                <div className="flex-1">
                  <div className="text-text-primary text-sm font-medium">{entry.username}</div>
                </div>

                {/* Value */}
                <div className="text-right">
                  <span className="text-accent-gold font-bold">{entry.value}</span>
                  <span className="text-text-secondary/60 text-xs ml-1">{entry.label}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-text-secondary/40 text-xs mt-6"
        >
          📊 数据每小时更新 · 登录后即可参与排名
        </motion.p>
      </div>
    </div>
  );
}
