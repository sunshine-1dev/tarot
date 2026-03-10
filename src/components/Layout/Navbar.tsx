import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthStore();

  const links = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/reading', label: '占卜', icon: '🔮' },
    { path: '/daily', label: '每日一牌', icon: '☀️' },
    { path: '/leaderboard', label: '排行榜', icon: '🏆' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-md border-b border-accent-purple/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          <span className="text-gold-gradient text-xl font-bold tracking-wider">星语塔罗</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                isActive(link.path)
                  ? 'bg-accent-purple/20 text-accent-gold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <span className="mr-1.5">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <div className="w-7 h-7 bg-gradient-to-br from-accent-gold/30 to-accent-purple/30
                rounded-full flex items-center justify-center text-sm border border-accent-gold/20">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  '🔮'
                )}
              </div>
              <span className="text-text-primary text-sm">{user.username}</span>
            </Link>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="px-4 py-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                登录
              </Link>
              <Link
                to="/auth/signup"
                className="px-4 py-1.5 text-sm bg-accent-gold/20 text-accent-gold rounded-full
                  hover:bg-accent-gold/30 transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-primary p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-bg-secondary/95 backdrop-blur-md border-b border-accent-purple/20"
        >
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-3 text-sm transition-all ${
                isActive(link.path)
                  ? 'bg-accent-purple/20 text-accent-gold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <span className="mr-2">{link.icon}</span>
              {link.label}
            </Link>
          ))}

          {/* Mobile auth links */}
          <div className="border-t border-accent-purple/10 mt-1 pt-1">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5"
                >
                  <span className="mr-2">👤</span>
                  {user.username}
                </Link>
                <Link
                  to="/history"
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5"
                >
                  <span className="mr-2">📜</span>
                  占卜历史
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-3 text-sm text-text-secondary hover:text-text-primary"
                >
                  <span className="mr-2">🔑</span>
                  登录
                </Link>
                <Link
                  to="/auth/signup"
                  onClick={() => setMenuOpen(false)}
                  className="block px-6 py-3 text-sm text-accent-gold"
                >
                  <span className="mr-2">✨</span>
                  注册
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
