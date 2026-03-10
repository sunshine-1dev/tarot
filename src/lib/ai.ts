import type { TarotCard } from './tarot-data';

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionLabel?: string;
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_API_KEY = 'sk-facc7b035e7746718974052c44bdebb4';
const DEEPSEEK_MODEL = 'deepseek-chat';

const SYSTEM_PROMPT = `你是一位经验丰富的塔罗牌解读师，名叫"星语"。你拥有数十年的塔罗牌解读经验，灵魂深处流淌着古老的智慧之光。

你的解读风格与原则：
1. 基于经典韦特塔罗（Rider-Waite）体系，融入你独特的直觉感应
2. 深入解析每张牌的传统含义、牌面象征符号（人物姿态、色彩、背景元素等）
3. 严格区分正位与逆位的能量差异，逆位不代表"坏"，而是能量的另一种流向
4. 结合牌阵中各位置的含义进行综合解读，揭示牌与牌之间的隐秘联系
5. 语言优美而温暖，富有诗意但不晦涩，像一位智慧的朋友在星空下与你低语
6. 给出积极、建设性的指引，即使是逆位或"困难"牌也要发掘成长的契机
7. 结尾给出一句富有力量的寄语，像一颗星星照亮求问者的前路

格式要求：
- 用 **加粗** 标记牌名和关键概念
- 用 > 引用格式写寄语
- 用 --- 分隔不同段落
- 每张牌的解读 2-4 句话
- 如果是多牌阵，最后给出整体综合解读

请用中文回答。你是星语，请以第一人称"我"的视角来解读。`;

function buildUserPrompt(cards: DrawnCard[], question?: string): string {
  const q = question || '请为我揭示当下的启示';

  if (cards.length === 1) {
    const { card, isReversed, positionLabel } = cards[0];
    const orientation = isReversed ? '逆位' : '正位';
    const position = positionLabel ? `（位置：${positionLabel}）` : '';
    return `用户问题：${q}

抽到的牌：**${card.nameCN}**（${card.name}）— ${orientation}${position}
牌面关键词：${card.keywords.join('、')}

请为这张牌给出深入解读。包含：
1. 这张牌在当前问题下的含义
2. 牌面象征符号的解析
3. 对用户的建议与指引
4. 一句温暖的寄语`;
  }

  // Multi-card spread
  let spreadName = '多牌阵';
  if (cards.length === 3) spreadName = '三牌阵（过去-现在-未来）';
  else if (cards.length === 10) spreadName = '凯尔特十字（10张牌）';

  let cardList = '';
  cards.forEach((drawn, i) => {
    const { card, isReversed, positionLabel } = drawn;
    const orientation = isReversed ? '逆位' : '正位';
    const label = positionLabel || `位置${i + 1}`;
    cardList += `${i + 1}. ${label}：**${card.nameCN}**（${card.name}）— ${orientation}，关键词：${card.keywords.join('、')}\n`;
  });

  let instructions = '';
  if (cards.length === 3) {
    instructions = `请依次解读每张牌在其位置上的含义，然后给出三张牌的综合解读。
关注过去如何影响现在，现在又如何指向未来。`;
  } else if (cards.length === 10) {
    instructions = `请按以下结构解读：
1. 逐张解读（每张 2-3 句，结合位置含义）
2. 核心主题分析（从 10 张牌中提取主线）
3. 综合建议（200 字左右的总结性指引）`;
  } else {
    instructions = '请依次解读每张牌的含义，然后给出综合解读。';
  }

  return `用户问题：${q}

牌阵：${spreadName}

${cardList}
${instructions}
最后请给出一句温暖的寄语。`;
}

export async function* streamInterpretation(
  cards: DrawnCard[],
  question?: string
): AsyncGenerator<string> {
  const userPrompt = buildUserPrompt(cards, question);

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.8,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API error:', response.status, errText);
      yield* fallbackInterpretation(cards, question);
      return;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      yield* fallbackInterpretation(cards, question);
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
          }
        } catch {
          // Skip malformed JSON lines
        }
      }
    }

    // Process any remaining buffer
    if (buffer.trim()) {
      const trimmed = buffer.trim();
      if (trimmed.startsWith('data: ') && trimmed.slice(6) !== '[DONE]') {
        try {
          const parsed = JSON.parse(trimmed.slice(6));
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch { /* skip */ }
      }
    }
  } catch (error) {
    console.error('Stream interpretation error:', error);
    yield* fallbackInterpretation(cards, question);
  }
}

async function* fallbackInterpretation(
  cards: DrawnCard[],
  question?: string
): AsyncGenerator<string> {
  const text = generateFallbackText(cards, question);
  // Simulate streaming with character-by-character output
  for (const char of text) {
    yield char;
    await new Promise(resolve => setTimeout(resolve, char === '\n' ? 30 : 15));
  }
}

function generateFallbackText(cards: DrawnCard[], question?: string): string {
  const greeting = question
    ? `🔮 **关于你的问题：** "${question}"\n\n`
    : '🔮 **宇宙为你揭示的信息：**\n\n';

  let body = '> ⚠️ AI 解读服务暂时不可用，以下为基础牌义参考：\n\n';

  cards.forEach((drawn) => {
    const { card, isReversed, positionLabel } = drawn;
    const position = positionLabel ? `**【${positionLabel}】** ` : '';
    const orientation = isReversed ? '逆位' : '正位';
    const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;

    body += `${position}**${card.nameCN}** (${card.name}) — ${orientation}\n\n`;
    body += `关键词：${card.keywords.join('、')}\n\n`;
    body += `${meaning}\n\n---\n\n`;
  });

  body += '> 🌟 愿星光为你指引方向，倾听内心的声音。✨';

  return greeting + body;
}

export function getInstantInterpretation(
  cards: DrawnCard[],
  question?: string
): string {
  return generateFallbackText(cards, question);
}
