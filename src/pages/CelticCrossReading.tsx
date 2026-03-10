import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadingStore } from '../stores/useStore';
import { useAuthStore } from '../stores/useAuthStore';
import TarotCard from '../components/TarotCard';
import ShuffleAnimation from '../components/ShuffleAnimation';
import InterpretationPanel from '../components/InterpretationPanel';
import AuthPrompt from '../components/AuthPrompt';
import { streamInterpretation } from '../lib/ai';

type Phase = 'question' | 'shuffle' | 'draw' | 'reveal';

const positions = [
  { label: '核心/现状', desc: '代表你当前的核心状况' },
  { label: '障碍/挑战', desc: '横跨在你面前的挑战' },
  { label: '潜意识/根基', desc: '深层的潜意识影响' },
  { label: '近期过去', desc: '正在消退的影响' },
  { label: '最高潜能', desc: '可能达到的最佳状态' },
  { label: '近期未来', desc: '即将到来的事件' },
  { label: '自我认知', desc: '你如何看待自己' },
  { label: '外部环境', desc: '周围人与环境的影响' },
  { label: '希望与恐惧', desc: '内心深处的期盼' },
  { label: '最终结果', desc: '最可能的结果' },
];

export default function CelticCrossReading() {
  const [phase, setPhase] = useState<Phase>('question');
  const [flippedCards, setFlippedCards] = useState<boolean[]>(Array(10).fill(false));
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { user } = useAuthStore();
  const {
    question, setQuestion,
    drawnCards, drawAndReveal,
    interpretation, appendInterpretation,
    isInterpreting, setIsInterpreting,
    resetReading,
  } = useReadingStore();

  const allFlipped = flippedCards.every(Boolean);

  const handleAsk = () => {
    setPhase('shuffle');
  };

  const handleShuffleComplete = () => {
    drawAndReveal(10);
    setPhase('draw');
  };

  const handleFlip = useCallback(async (index: number) => {
    if (flippedCards[index]) return;

    const newFlipped = [...flippedCards];
    newFlipped[index] = true;
    setFlippedCards(newFlipped);

    if (newFlipped.every(Boolean)) {
      setPhase('reveal');
      setIsInterpreting(true);
      const drawn = useReadingStore.getState().drawnCards;
      const q = useReadingStore.getState().question;

      const cards = drawn.map((d, i) => ({
        card: d.card,
        isReversed: d.isReversed,
        positionLabel: positions[i].label,
      }));

      try {
        for await (const char of streamInterpretation(cards, q || undefined)) {
          appendInterpretation(char);
        }
      } finally {
        setIsInterpreting(false);
        if (!user) {
          setTimeout(() => setShowAuthPrompt(true), 2000);
        }
      }
    }
  }, [flippedCards, setIsInterpreting, appendInterpretation, user]);

  const handleReset = () => {
    resetReading();
    setFlippedCards(Array(10).fill(false));
    setPhase('question');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            ☘️ <span className="text-gold-gradient">凯尔特十字</span>
          </h1>
          <p className="text-text-secondary">最经典的十牌阵，全面揭示你的处境</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Phase 1: Question */}
          {phase === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="w-full max-w-md">
                <label className="block text-sm text-text-secondary mb-2">
                  提出你想要全面解读的问题
                </label>
                <textarea
                  className="w-full bg-bg-secondary/80 border border-accent-purple/20 rounded-xl p-4
                    text-text-primary placeholder:text-text-secondary/40 focus:outline-none
                    focus:border-accent-gold/50 transition-colors resize-none"
                  rows={3}
                  placeholder="例如：我当前的人生处境如何？我应该如何面对眼前的挑战？"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-accent-gold to-amber-600 text-bg-primary
                  rounded-full font-bold text-lg hover:shadow-lg hover:shadow-accent-gold/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAsk}
              >
                ☘️ 开始洗牌
              </motion.button>
            </motion.div>
          )}

          {/* Phase 2: Shuffle */}
          {phase === 'shuffle' && (
            <motion.div
              key="shuffle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ShuffleAnimation onComplete={handleShuffleComplete} />
            </motion.div>
          )}

          {/* Phase 3 & 4: Draw & Reveal */}
          {(phase === 'draw' || phase === 'reveal') && drawnCards.length === 10 && (
            <motion.div
              key="draw"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-8"
            >
              {!allFlipped && (
                <motion.p
                  className="text-accent-gold text-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ✨ 依次点击十张牌揭示凯尔特十字
                </motion.p>
              )}

              {/* Celtic Cross Layout */}
              <div className="relative w-full max-w-3xl mx-auto" style={{ minHeight: '600px' }}>
                {/* Cross Section - Center */}
                {/* Position 1: Significator (center) */}
                <div className="absolute" style={{ left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}>
                  <CelticCard
                    drawn={drawnCards[0]}
                    index={0}
                    flipped={flippedCards[0]}
                    onFlip={handleFlip}
                    label={positions[0].label}
                  />
                </div>

                {/* Position 2: Crossing (overlaps center, rotated) */}
                <div className="absolute" style={{ left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}>
                  <div className="rotate-90 opacity-90">
                    <CelticCard
                      drawn={drawnCards[1]}
                      index={1}
                      flipped={flippedCards[1]}
                      onFlip={handleFlip}
                      label={positions[1].label}
                    />
                  </div>
                </div>

                {/* Position 3: Foundation (below center) */}
                <div className="absolute" style={{ left: '50%', top: '75%', transform: 'translate(-50%, -50%)' }}>
                  <CelticCard
                    drawn={drawnCards[2]}
                    index={2}
                    flipped={flippedCards[2]}
                    onFlip={handleFlip}
                    label={positions[2].label}
                  />
                </div>

                {/* Position 4: Recent Past (left of center) */}
                <div className="absolute" style={{ left: '20%', top: '40%', transform: 'translate(-50%, -50%)' }}>
                  <CelticCard
                    drawn={drawnCards[3]}
                    index={3}
                    flipped={flippedCards[3]}
                    onFlip={handleFlip}
                    label={positions[3].label}
                  />
                </div>

                {/* Position 5: Crown (above center) */}
                <div className="absolute" style={{ left: '50%', top: '5%', transform: 'translate(-50%, -50%)' }}>
                  <CelticCard
                    drawn={drawnCards[4]}
                    index={4}
                    flipped={flippedCards[4]}
                    onFlip={handleFlip}
                    label={positions[4].label}
                  />
                </div>

                {/* Position 6: Near Future (right of center) */}
                <div className="absolute" style={{ left: '80%', top: '40%', transform: 'translate(-50%, -50%)' }}>
                  <CelticCard
                    drawn={drawnCards[5]}
                    index={5}
                    flipped={flippedCards[5]}
                    onFlip={handleFlip}
                    label={positions[5].label}
                  />
                </div>

                {/* Staff Section - Right Column (positions 7-10, bottom to top) */}
                {/* Position 7: Self */}
                <div className="absolute hidden md:block" style={{ right: '-5%', top: '75%', transform: 'translate(-50%, -50%)' }}>
                  <CelticCard
                    drawn={drawnCards[6]}
                    index={6}
                    flipped={flippedCards[6]}
                    onFlip={handleFlip}
                    label={positions[6].label}
                  />
                </div>

                {/* Position 8: Environment */}
                <div className="absolute hidden md:block" style={{ right: '-5%', top: '52%', transform: 'translate(-50%, -50%)' }}>
                  <CelticCard
                    drawn={drawnCards[7]}
                    index={7}
                    flipped={flippedCards[7]}
                    onFlip={handleFlip}
                    label={positions[7].label}
                  />
                </div>

                {/* Position 9: Hopes & Fears */}
                <div className="absolute hidden md:block" style={{ right: '-5%', top: '28%', transform: 'translate(-50%, -50%)' }}>
                  <CelticCard
                    drawn={drawnCards[8]}
                    index={8}
                    flipped={flippedCards[8]}
                    onFlip={handleFlip}
                    label={positions[8].label}
                  />
                </div>

                {/* Position 10: Outcome */}
                <div className="absolute hidden md:block" style={{ right: '-5%', top: '5%', transform: 'translate(-50%, -50%)' }}>
                  <CelticCard
                    drawn={drawnCards[9]}
                    index={9}
                    flipped={flippedCards[9]}
                    onFlip={handleFlip}
                    label={positions[9].label}
                  />
                </div>
              </div>

              {/* Mobile: show staff cards in a row */}
              <div className="md:hidden grid grid-cols-4 gap-2 mt-4">
                {[6, 7, 8, 9].map(i => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-accent-gold/70 text-[10px] mb-1">{positions[i].label}</span>
                    <TarotCard
                      card={drawnCards[i].card}
                      isReversed={drawnCards[i].isReversed}
                      isFlipped={flippedCards[i]}
                      onFlip={() => handleFlip(i)}
                      size="sm"
                    />
                  </div>
                ))}
              </div>

              {/* Interpretation */}
              <InterpretationPanel text={interpretation} isLoading={isInterpreting} />

              {/* Reset button */}
              {allFlipped && !isInterpreting && interpretation && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 px-6 py-2.5 border border-accent-purple/30 text-text-secondary
                    rounded-full hover:text-text-primary hover:border-accent-gold/40 transition-all"
                  onClick={handleReset}
                >
                  🔄 再来一次
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthPrompt show={showAuthPrompt} onClose={() => setShowAuthPrompt(false)} />
    </div>
  );
}

// Small card component for the celtic layout
function CelticCard({
  drawn,
  index,
  flipped,
  onFlip,
  label,
}: {
  drawn: { card: import('../lib/tarot-data').TarotCard; isReversed: boolean };
  index: number;
  flipped: boolean;
  onFlip: (i: number) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <TarotCard
        card={drawn.card}
        isReversed={drawn.isReversed}
        isFlipped={flipped}
        onFlip={() => onFlip(index)}
        size="sm"
        showLabel={true}
        label={label}
      />
    </div>
  );
}
