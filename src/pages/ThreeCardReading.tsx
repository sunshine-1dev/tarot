import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadingStore } from '../stores/useStore';
import TarotCard from '../components/TarotCard';
import ShuffleAnimation from '../components/ShuffleAnimation';
import InterpretationPanel from '../components/InterpretationPanel';
import { streamInterpretation } from '../lib/ai';

type Phase = 'question' | 'shuffle' | 'draw' | 'reveal';

const positionLabels = ['过去', '现在', '未来'];
const positionDescs = [
  '影响当前局势的过往因素',
  '当前的核心状态与挑战',
  '可能的发展方向与趋势',
];

export default function ThreeCardReading() {
  const [phase, setPhase] = useState<Phase>('question');
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false]);
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
    drawAndReveal(3);
    setPhase('draw');
  };

  const handleFlip = useCallback(async (index: number) => {
    if (flippedCards[index]) return;

    const newFlipped = [...flippedCards];
    newFlipped[index] = true;
    setFlippedCards(newFlipped);

    // If all three are flipped, start AI interpretation
    if (newFlipped.every(Boolean)) {
      setPhase('reveal');
      setIsInterpreting(true);
      const drawn = useReadingStore.getState().drawnCards;
      const q = useReadingStore.getState().question;

      const cards = drawn.map((d, i) => ({
        card: d.card,
        isReversed: d.isReversed,
        positionLabel: positionLabels[i],
      }));

      try {
        for await (const char of streamInterpretation(cards, q || undefined)) {
          appendInterpretation(char);
        }
      } finally {
        setIsInterpreting(false);
      }
    }
  }, [flippedCards, setIsInterpreting, appendInterpretation]);

  const handleReset = () => {
    resetReading();
    setFlippedCards([false, false, false]);
    setPhase('question');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            🔮 <span className="text-gold-gradient">三牌阵占卜</span>
          </h1>
          <p className="text-text-secondary">过去 · 现在 · 未来</p>
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
                  在心中想一个问题，三张牌将揭示过去的因、现在的果、未来的路
                </label>
                <textarea
                  className="w-full bg-bg-secondary/80 border border-accent-purple/20 rounded-xl p-4 
                    text-text-primary placeholder:text-text-secondary/40 focus:outline-none 
                    focus:border-accent-gold/50 transition-colors resize-none"
                  rows={3}
                  placeholder="例如：我的事业发展方向是什么？这段感情的走向如何？"
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
                🔮 开始洗牌
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
          {(phase === 'draw' || phase === 'reveal') && drawnCards.length === 3 && (
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
                  ✨ 依次点击三张牌翻开命运
                </motion.p>
              )}

              {/* Three cards layout */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                {drawnCards.map((drawn, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    {/* Position label */}
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <div className="text-accent-gold font-bold text-lg">{positionLabels[i]}</div>
                      <div className="text-text-secondary/60 text-xs">{positionDescs[i]}</div>
                    </motion.div>

                    <TarotCard
                      card={drawn.card}
                      isReversed={drawn.isReversed}
                      isFlipped={flippedCards[i]}
                      onFlip={() => handleFlip(i)}
                      size="md"
                      delay={i * 0.15}
                    />
                  </div>
                ))}
              </div>

              {/* Keywords display after all flipped */}
              {allFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  {drawnCards.map((drawn, i) => (
                    <div key={i} className="text-center">
                      <div className="text-sm text-accent-gold/70 mb-1">{positionLabels[i]}</div>
                      <div className="flex flex-wrap justify-center gap-1">
                        {drawn.card.keywords.slice(0, 2).map(kw => (
                          <span key={kw} className="px-2 py-0.5 bg-accent-purple/20 text-accent-gold/80 text-xs rounded-full">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

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
    </div>
  );
}
