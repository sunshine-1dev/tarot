import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AuthPromptProps {
  show: boolean;
  onClose: () => void;
  message?: string;
}

export default function AuthPrompt({ show, onClose, message }: AuthPromptProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-bg-secondary border border-accent-purple/30 rounded-2xl p-8 max-w-sm w-full text-center"
          >
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              {message || '登录后即可保存占卜记录'}
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              创建账号后可以保存所有占卜记录、查看历史、参与排行榜
            </p>

            <div className="space-y-3">
              <Link to="/auth/signup" onClick={onClose}>
                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-accent-gold to-amber-600 text-bg-primary
                    rounded-xl font-bold hover:shadow-lg hover:shadow-accent-gold/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🌟 免费注册
                </motion.button>
              </Link>

              <Link to="/auth/login" onClick={onClose}>
                <motion.button
                  className="w-full py-3 border border-accent-purple/30 text-text-secondary
                    rounded-xl hover:text-text-primary hover:border-accent-gold/40 transition-all mt-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  已有账号？去登录
                </motion.button>
              </Link>
            </div>

            <button
              onClick={onClose}
              className="mt-4 text-text-secondary/50 text-sm hover:text-text-secondary transition-colors"
            >
              暂时不了，继续占卜
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
