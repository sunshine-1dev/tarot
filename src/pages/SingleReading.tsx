import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadingStore } from '../stores/useStore';
import { useAuthStore } from '../stores/useAuthStore';
import TarotCard from '../components/TarotCard';
import ShuffleAnimation from '../components/ShuffleAnimation';
import InterpretationPanel from '../components/InterpretationPanel';
import { streamInterpretation } from '../lib/ai';
import { saveReadingRecord } from '../lib/readings';

type Phase = 'question' | 'shuffle' | 'draw' | 'reveal';

export default function SingleReading() {
  const [phase, setPhase] = useState<Phase>('question');
  const { user } = useAuthStore();
  const {
    question, setQuestion,
    drawnCards, drawAndReveal,
    isRevealed, setRevealed,
    interpretation, appendInterpretation,
    isInterpreting, setIsInterpreting,
    resetReading,
  } = useReadingStore();

  const handleAsk = () => {
    setPhase('shuffle');
  };

  const handleShuffleComplete = () => {
    drawAndReveal(1);
    setPhase('draw');
  };

  const handleFlip = useCallback(async () => {
    if (isRevealed) return;
    setRevealed(true);
    setPhase('reveal');

    // Start AI interpretation
    setIsInterpreting(true);
    const drawn = useReadingStore.getState().drawnCards;
    const q = useReadingStore.getState().question;

    const cards = drawn.map(d => ({
      card: d.card,
      isReversed: d.isReversed,
      positionLabel: '当下启示',
    }));

    let fullText = '';
    try {
      for await (const chunk of streamInterpretation(cards, q || undefined)) {
        fullText += chunk;
        appendInterpretation(chunk);
      }
    } finally {
      setIsInterpreting(false);
      // Save record if user is logged in
      if (user && fullText) {
        saveReadingRecord(user.id, q || null, 'single', '单牌占卜', cards, fullText);
      }
    }
  }, [isRevealed, setRevealed, setIsInterpreting, appendInterpretation, user]);

  const handleReset = () => {
    resetReading();
    setPhase('question');
  };

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
            🎴 <span className="text-gold-gradient">单牌占卜</span>
          </h1>
          <p className="text-text-secondary">抽取一张牌，聆听宇宙的低语</p>
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
                  在心中想一个问题，或留空让宇宙自由指引
                </label>
                <textarea
                  className="w-full bg-bg-secondary/80 border border-accent-purple/20 rounded-xl p-4 
                    text-text-primary placeholder:text-text-secondary/40 focus:outline-none 
                    focus:border-accent-gold/50 transition-colors resize-none"
                  rows={3}
                  placeholder="例如：我最近该注意什么？我和他/她的关系会怎样发展？"
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
          {(phase === 'draw' || phase === 'reveal') && drawnCards.length > 0 && (
            <motion.div
              key="draw"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-6"
            >
              {!isRevealed && (
                <motion.p
                  className="text-accent-gold text-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  ✨ 点击牌面翻开你的命运
                </motion.p>
              )}

              <TarotCard
                card={drawnCards[0].card}
                isReversed={drawnCards[0].isReversed}
                isFlipped={isRevealed}
                onFlip={handleFlip}
                size="lg"
              />

              {/* Card meaning summary */}
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center max-w-md"
                >
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {drawnCards[0].card.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-3 py-1 bg-accent-purple/20 text-accent-gold text-xs rounded-full"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Interpretation */}
              <InterpretationPanel text={interpretation} isLoading={isInterpreting} />

              {/* Reset button */}
              {isRevealed && !isInterpreting && interpretation && (
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
