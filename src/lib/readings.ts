import { supabase } from './supabase';
import type { TarotCard } from './tarot-data';

interface DrawnCardData {
  card: TarotCard;
  isReversed: boolean;
  positionLabel?: string;
}

// Stored card format in JSONB
interface StoredCard {
  card_id: number;
  card_name: string;
  card_name_cn: string;
  is_reversed: boolean;
  position_label: string | null;
  keywords: string[];
}

export interface ReadingRecord {
  id: string;
  user_id: string;
  question: string | null;
  spread_id: string;
  spread_name: string;
  drawn_cards: StoredCard[];
  interpretation: string;
  created_at: string;
}

export async function saveReadingRecord(
  userId: string,
  question: string | null,
  spreadId: string,
  spreadName: string,
  drawnCards: DrawnCardData[],
  interpretation: string
): Promise<ReadingRecord | null> {
  try {
    // Serialize drawn cards for JSONB storage
    const cardsJson = drawnCards.map(dc => ({
      card_id: dc.card.id,
      card_name: dc.card.name,
      card_name_cn: dc.card.nameCN,
      is_reversed: dc.isReversed,
      position_label: dc.positionLabel || null,
      keywords: dc.card.keywords,
    }));

    const { data, error } = await supabase
      .from('reading_records')
      .insert({
        user_id: userId,
        question: question || null,
        spread_id: spreadId,
        spread_name: spreadName,
        drawn_cards: cardsJson,
        interpretation,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to save reading record:', error);
      return null;
    }

    return data as ReadingRecord;
  } catch (e) {
    console.error('Error saving reading record:', e);
    return null;
  }
}

export async function fetchReadingHistory(
  userId: string,
  limit = 50
): Promise<ReadingRecord[]> {
  try {
    const { data, error } = await supabase
      .from('reading_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch reading history:', error);
      return [];
    }

    return (data || []) as ReadingRecord[];
  } catch (e) {
    console.error('Error fetching reading history:', e);
    return [];
  }
}
