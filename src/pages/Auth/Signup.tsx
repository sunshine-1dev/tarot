import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/useAuthStore';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { signup, loginWithGitHub, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      return;
    }
    const success = await signup(email, password, username);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gold-gradient">加入星语塔罗</span>
          </h1>
          <p className="text-text-secondary text-sm">创建账号，开始你的塔罗之旅</p>
        </div>

        {/* Form */}
        <div className="bg-bg-secondary/60 backdrop-blur-sm border border-accent-purple/20 rounded-2xl p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center"
              onClick={clearError}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-text-secondary mb-2">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-bg-primary/80 border border-accent-purple/20 rounded-xl px-4 py-3
                  text-text-primary placeholder:text-text-secondary/40 focus:outline-none
                  focus:border-accent-gold/50 transition-colors"
                placeholder="你的占卜师名号"
                required
                minLength={2}
                maxLength={20}
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">邮箱地址</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-primary/80 border border-accent-purple/20 rounded-xl px-4 py-3
                  text-text-primary placeholder:text-text-secondary/40 focus:outline-none
                  focus:border-accent-gold/50 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-primary/80 border border-accent-purple/20 rounded-xl px-4 py-3
                  text-text-primary placeholder:text-text-secondary/40 focus:outline-none
                  focus:border-accent-gold/50 transition-colors"
                placeholder="至少 6 位密码"
                required
                minLength={6}
              />
              <p className="text-text-secondary/40 text-xs mt-1">至少 6 个字符</p>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-accent-gold to-amber-600 text-bg-primary
                rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-accent-gold/20
                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? '注册中...' : '🌟 创建账号'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-accent-purple/20" />
            <span className="text-text-secondary/60 text-sm">或</span>
            <div className="flex-1 h-px bg-accent-purple/20" />
          </div>

          {/* GitHub OAuth */}
          <motion.button
            onClick={loginWithGitHub}
            className="w-full py-3 bg-bg-primary/80 border border-accent-purple/30 rounded-xl
              text-text-primary font-medium hover:border-accent-gold/40 transition-all
              flex items-center justify-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            使用 GitHub 注册
          </motion.button>

          {/* Login link */}
          <p className="text-center text-text-secondary text-sm mt-6">
            已有账号？{' '}
            <Link to="/auth/login" className="text-accent-gold hover:underline">
              立即登录
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-3"
        >
          {[
            { icon: '💾', text: '保存占卜记录' },
            { icon: '📊', text: '个人数据统计' },
            { icon: '🏆', text: '排行榜竞技' },
          ].map((item) => (
            <div
              key={item.text}
              className="text-center p-3 bg-bg-secondary/30 rounded-xl border border-accent-purple/10"
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-text-secondary text-xs">{item.text}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
