import { create } from 'zustand';
import type { TarotCard } from '../lib/tarot-data';
import { drawCards } from '../lib/tarot-data';

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
}

interface ReadingState {
  question: string;
  drawnCards: DrawnCard[];
  isShuffling: boolean;
  isRevealed: boolean;
  interpretation: string;
  isInterpreting: boolean;

  setQuestion: (question: string) => void;
  startShuffle: () => void;
  drawAndReveal: (count: number) => void;
  setRevealed: (revealed: boolean) => void;
  appendInterpretation: (text: string) => void;
  setInterpretation: (text: string) => void;
  setIsInterpreting: (interpreting: boolean) => void;
  resetReading: () => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  question: '',
  drawnCards: [],
  isShuffling: false,
  isRevealed: false,
  interpretation: '',
  isInterpreting: false,

  setQuestion: (question) => set({ question }),

  startShuffle: () => set({ isShuffling: true, isRevealed: false, drawnCards: [], interpretation: '' }),

  drawAndReveal: (count) => {
    const cards = drawCards(count);
    set({ drawnCards: cards, isShuffling: false });
  },

  setRevealed: (revealed) => set({ isRevealed: revealed }),

  appendInterpretation: (text) => set((state) => ({ interpretation: state.interpretation + text })),

  setInterpretation: (text) => set({ interpretation: text }),

  setIsInterpreting: (interpreting) => set({ isInterpreting: interpreting }),

  resetReading: () => set({
    question: '',
    drawnCards: [],
    isShuffling: false,
    isRevealed: false,
    interpretation: '',
    isInterpreting: false,
  }),
}));

// Daily card store
interface DailyState {
  todayCard: DrawnCard | null;
  date: string;
  drawDailyCard: () => void;
}

export const useDailyStore = create<DailyState>((set, get) => ({
  todayCard: null,
  date: '',

  drawDailyCard: () => {
    const today = new Date().toISOString().split('T')[0];
    const current = get();
    if (current.date === today && current.todayCard) return;

    const cards = drawCards(1);
    set({
      todayCard: cards[0],
      date: today,
    });
  },
}));
