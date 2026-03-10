import { motion } from 'framer-motion';
import type { TarotCard as TarotCardType } from '../lib/tarot-data';
import { useState } from 'react';

interface TarotCardProps {
  card: TarotCardType;
  isReversed: boolean;
  isFlipped: boolean;
  onFlip?: () => void;
  size?: 'sm' | 'md' | 'lg';
  delay?: number;
  showLabel?: boolean;
  label?: string;
}

export default function TarotCard({
  card,
  isReversed,
  isFlipped,
  onFlip,
  size = 'md',
  delay = 0,
  showLabel = false,
  label,
}: TarotCardProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-28 h-44',
    md: 'w-40 h-60',
    lg: 'w-52 h-80',
  };

  const cardBack = (
    <div className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden border-2 border-accent-gold/30
      bg-gradient-to-br from-accent-purple/80 via-bg-card to-accent-purple/60
      flex items-center justify-center`}
    >
      <div className="absolute inset-2 border border-accent-gold/20 rounded-lg" />
      <div className="text-center">
        <div className="text-4xl mb-2">🔮</div>
        <div className="text-accent-gold/60 text-xs font-serif tracking-widest">TAROT</div>
      </div>
      {/* Decorative corners */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-accent-gold/30" />
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-accent-gold/30" />
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-accent-gold/30" />
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-accent-gold/30" />
    </div>
  );

  const cardFront = (
    <div
      className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden border-2 
        ${isReversed ? 'border-accent-purple/50' : 'border-accent-gold/50'}
        bg-bg-card`}
    >
      {!imgError ? (
        <img
          src={card.image}
          alt={card.nameCN}
          className={`w-full h-full object-cover ${isReversed ? 'rotate-180' : ''}`}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`w-full h-full flex flex-col items-center justify-center p-3 text-center
          bg-gradient-to-br from-bg-card to-bg-secondary ${isReversed ? 'rotate-180' : ''}`}
        >
          <div className="text-3xl mb-2">
            {card.arcana === 'major' ? '⭐' : card.suit === 'wands' ? '🪄' : card.suit === 'cups' ? '🏆' : card.suit === 'swords' ? '⚔️' : '💰'}
          </div>
          <div className="text-accent-gold text-sm font-bold">{card.nameCN}</div>
          <div className="text-text-secondary text-xs mt-1">{card.name}</div>
          <div className="text-accent-gold/40 text-[10px] mt-2">{card.id}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`${sizeClasses[size]} perspective-1000 cursor-pointer relative`}
        onClick={onFlip}
        whileHover={!isFlipped ? { scale: 1.05, y: -5 } : {}}
        whileTap={!isFlipped ? { scale: 0.98 } : {}}
      >
        <motion.div
          className="w-full h-full preserve-3d relative"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay }}
        >
          {cardBack}
          {cardFront}
        </motion.div>

        {/* Glow effect when flipped */}
        {isFlipped && (
          <motion.div
            className={`absolute -inset-1 rounded-xl ${isReversed ? 'glow-purple' : 'glow-gold'} opacity-50`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: delay + 0.5, duration: 0.5 }}
          />
        )}
      </motion.div>

      {showLabel && label && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.3 }}
        >
          <span className="text-accent-gold text-sm font-medium">{label}</span>
        </motion.div>
      )}

      {isFlipped && (
        <motion.div
          className="text-center max-w-[160px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.6 }}
        >
          <div className="text-text-primary text-sm font-bold">{card.nameCN}</div>
          <div className="text-text-secondary text-xs">{card.name}</div>
          <div className={`text-xs mt-1 ${isReversed ? 'text-accent-purple' : 'text-accent-gold'}`}>
            {isReversed ? '逆位 ↓' : '正位 ↑'}
          </div>
        </motion.div>
      )}
    </div>
  );
}
