import { motion } from 'framer-motion';

interface ShuffleAnimationProps {
  onComplete: () => void;
}

export default function ShuffleAnimation({ onComplete }: ShuffleAnimationProps) {
  const cards = Array.from({ length: 7 });

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <motion.p
        className="text-accent-gold text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        ✨ 洗牌中...请在心中默念你的问题
      </motion.p>

      <div className="relative w-64 h-44">
        {cards.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-28 h-44 rounded-xl border-2 border-accent-gold/30
              bg-gradient-to-br from-accent-purple/80 via-bg-card to-accent-purple/60"
            style={{ left: '50%', top: 0 }}
            initial={{ x: '-50%', rotateZ: 0 }}
            animate={{
              x: ['-50%', `${(i - 3) * 40 - 50}%`, '-50%'],
              rotateZ: [0, (i - 3) * 15, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: 1,
              ease: 'easeInOut',
              delay: i * 0.08,
            }}
          >
            <div className="absolute inset-2 border border-accent-gold/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔮</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-gold/80 
          text-white rounded-full font-medium hover:opacity-90 transition-opacity"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        onClick={onComplete}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        停止洗牌，开始翻牌 ✨
      </motion.button>
    </div>
  );
}
