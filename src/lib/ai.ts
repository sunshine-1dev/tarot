import type { TarotCard } from './tarot-data';

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionLabel?: string;
}

function generateMockInterpretation(cards: DrawnCard[], question?: string): string {
  const greeting = question
    ? `🔮 **关于你的问题：** "${question}"\n\n`
    : '🔮 **宇宙为你揭示的信息：**\n\n';

  let body = '';

  cards.forEach((drawn, index) => {
    const { card, isReversed, positionLabel } = drawn;
    const position = positionLabel ? `**【${positionLabel}】** ` : '';
    const orientation = isReversed ? '逆位' : '正位';
    const meaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
    const keywords = card.keywords.join('、');

    body += `${position}**${card.nameCN}** (${card.name}) — ${orientation}\n\n`;
    body += `关键词：${keywords}\n\n`;
    body += `${meaning}\n\n`;

    if (isReversed) {
      body += `逆位的${card.nameCN}提醒你，当前的状态需要更多的内在探索。不要被表面的困难所迷惑，`;
      body += `在挑战中往往蕴含着成长的机会。试着换个角度审视你所面临的处境。\n\n`;
    } else {
      body += `正位的${card.nameCN}带来积极的能量。宇宙正在为你打开一扇门，`;
      body += `信任这个过程，保持开放的心态去迎接即将到来的转变。\n\n`;
    }

    if (index < cards.length - 1) {
      body += '---\n\n';
    }
  });

  if (cards.length > 1) {
    body += '---\n\n';
    body += '**✨ 综合解读：**\n\n';
    body += '从牌阵的整体来看，你正处在一个重要的转折点。';
    
    const majorCards = cards.filter(c => c.card.arcana === 'major');
    if (majorCards.length > 0) {
      body += `大阿卡纳牌"${majorCards.map(c => c.card.nameCN).join('"和"')}"的出现表明，这不仅仅是日常的变化，而是灵魂层面的成长与蜕变。`;
    }
    
    const reversedCount = cards.filter(c => c.isReversed).length;
    if (reversedCount > cards.length / 2) {
      body += '较多的逆位牌暗示着当前需要更多的内省和调整。放慢脚步，聆听内心的声音。';
    } else {
      body += '整体能量是积极向上的，宇宙在支持你的方向。保持信心，大胆前行。';
    }
    
    body += '\n\n';
  }

  body += '**🌟 寄语：**\n\n';
  body += '> 塔罗牌是宇宙与你对话的桥梁。无论牌面如何，记住——命运掌握在自己手中。';
  body += '牌所展示的只是可能性，而你的选择才是最终的决定力量。愿你在星光的指引下，找到内心的答案。✨';

  return greeting + body;
}

export async function* streamInterpretation(
  cards: DrawnCard[],
  question?: string
): AsyncGenerator<string> {
  const fullText = generateMockInterpretation(cards, question);
  const chars = fullText.split('');

  for (let i = 0; i < chars.length; i++) {
    yield chars[i];
    // Variable delay for more natural effect
    const delay = chars[i] === '\n' ? 50 : chars[i] === '。' ? 80 : Math.random() * 20 + 10;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

export function getInstantInterpretation(
  cards: DrawnCard[],
  question?: string
): string {
  return generateMockInterpretation(cards, question);
}
