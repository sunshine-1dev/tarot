import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { drawCards } from '../lib/tarot-data';
import type { TarotCard as TarotCardType } from '../lib/tarot-data';
import TarotCard from '../components/TarotCard';
import InterpretationPanel from '../components/InterpretationPanel';
import { streamInterpretation } from '../lib/ai';

interface DailyCardState {
  card: TarotCardType;
  isReversed: boolean;
  date: string;
}

export default function DailyDraw() {
  const [dailyCard, setDailyCard] = useState<DailyCardState | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [interpretation, setInterpretation] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  useEffect(() => {
    // Check localStorage for today's draw
    const savedDate = localStorage.getItem('daily-draw-date');
    const todayStr = new Date().toISOString().split('T')[0];

    if (savedDate === todayStr) {
      const savedCard = JSON.parse(localStorage.getItem('daily-draw-card') || 'null');
      const savedInterp = localStorage.getItem('daily-draw-interpretation') || '';
      if (savedCard) {
        setDailyCard({ ...savedCard, date: todayStr });
        setIsFlipped(true);
        setInterpretation(savedInterp);
        setHasDrawnToday(true);
      }
    }
  }, []);

  const handleDraw = useCallback(() => {
    const [drawn] = drawCards(1);
    const todayStr = new Date().toISOString().split('T')[0];
    const newCard: DailyCardState = { card: drawn.card, isReversed: drawn.isReversed, date: todayStr };
    setDailyCard(newCard);

    // Save to localStorage
    localStorage.setItem('daily-draw-date', todayStr);
    localStorage.setItem('daily-draw-card', JSON.stringify({ card: drawn.card, isReversed: drawn.isReversed }));
  }, []);

  const handleFlip = useCallback(async () => {
    if (isFlipped || !dailyCard) return;
    setIsFlipped(true);
    setHasDrawnToday(true);

    // Start AI interpretation
    setIsInterpreting(true);
    const cards = [{
      card: dailyCard.card,
      isReversed: dailyCard.isReversed,
      positionLabel: '今日指引',
    }];

    let fullText = '';
    try {
      for await (const char of streamInterpretation(cards, '请为我的今天给出指引')) {
        fullText += char;
        setInterpretation(fullText);
      }
      localStorage.setItem('daily-draw-interpretation', fullText);
    } finally {
      setIsInterpreting(false);
    }
  }, [isFlipped, dailyCard]);

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
            ☀️ <span className="text-gold-gradient">每日一牌</span>
          </h1>
          <p className="text-text-secondary">{today}</p>
          <p className="text-text-secondary/60 text-sm mt-1">每天清晨，让一张牌为你的一天定调</p>
        </motion.div>

        <div className="flex flex-col items-center gap-8">
          {/* Not drawn yet */}
          {!dailyCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="text-center max-w-md text-text-secondary">
                <p className="mb-4">
                  深呼吸，放空思绪，让宇宙为你选择今天的指引之牌。
                </p>
                <p className="text-sm text-text-secondary/60">
                  每日一牌不占卜具体问题，而是为你揭示今天的能量主题。
                </p>
              </div>

              <motion.button
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-accent-gold text-bg-primary 
                  rounded-full font-bold text-lg hover:shadow-lg hover:shadow-accent-gold/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDraw}
              >
                ☀️ 抽取今日之牌
              </motion.button>
            </motion.div>
          )}

          {/* Card drawn but not flipped */}
          {dailyCard && !isFlipped && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <motion.p
                className="text-accent-gold text-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                ✨ 点击翻开今日之牌
              </motion.p>

              <TarotCard
                card={dailyCard.card}
                isReversed={dailyCard.isReversed}
                isFlipped={false}
                onFlip={handleFlip}
                size="lg"
              />
            </motion.div>
          )}

          {/* Card revealed */}
          {dailyCard && isFlipped && (
            <motion.div
              initial={hasDrawnToday ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <TarotCard
                card={dailyCard.card}
                isReversed={dailyCard.isReversed}
                isFlipped={true}
                size="lg"
              />

              {/* Keywords */}
              <div className="flex flex-wrap justify-center gap-2">
                {dailyCard.card.keywords.map(kw => (
                  <span
                    key={kw}
                    className="px-3 py-1 bg-accent-purple/20 text-accent-gold text-xs rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>

              {/* Quick meaning */}
              <div className="text-center max-w-md">
                <p className="text-text-primary text-sm">
                  {dailyCard.isReversed ? dailyCard.card.reversedMeaning : dailyCard.card.uprightMeaning}
                </p>
              </div>

              {/* AI Interpretation */}
              <InterpretationPanel text={interpretation} isLoading={isInterpreting} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
