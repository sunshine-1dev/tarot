export interface SpreadPosition {
  key: string;
  label: string;
  labelCN: string;
  description: string;
}

export interface SpreadType {
  id: string;
  name: string;
  nameCN: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
  icon: string;
}

export const spreads: SpreadType[] = [
  {
    id: 'single',
    name: 'Single Card',
    nameCN: '单牌占卜',
    description: '抽取一张牌，获得当下最需要的启示',
    cardCount: 1,
    icon: '🎴',
    positions: [
      { key: 'present', label: 'Present', labelCN: '当下启示', description: '此刻宇宙想要告诉你的信息' },
    ],
  },
  {
    id: 'three-card',
    name: 'Three Card Spread',
    nameCN: '三牌阵',
    description: '过去、现在、未来——时间之河的三个节点',
    cardCount: 3,
    icon: '🔮',
    positions: [
      { key: 'past', label: 'Past', labelCN: '过去', description: '影响当前局势的过往因素' },
      { key: 'present', label: 'Present', labelCN: '现在', description: '当前的核心状态与挑战' },
      { key: 'future', label: 'Future', labelCN: '未来', description: '可能的发展方向与趋势' },
    ],
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    nameCN: '凯尔特十字',
    description: '最经典的十牌阵，全面深入地揭示你的处境',
    cardCount: 10,
    icon: '☘️',
    positions: [
      { key: 'significator', label: 'Significator', labelCN: '核心/现状', description: '代表你当前的核心状况' },
      { key: 'crossing', label: 'Crossing', labelCN: '障碍/挑战', description: '横跨在你面前的障碍与挑战' },
      { key: 'foundation', label: 'Foundation', labelCN: '潜意识/根基', description: '潜意识的影响与深层根基' },
      { key: 'recent_past', label: 'Recent Past', labelCN: '近期过去', description: '刚刚经历或正在消退的影响' },
      { key: 'crown', label: 'Crown', labelCN: '最高潜能', description: '可能达到的最佳状态' },
      { key: 'near_future', label: 'Near Future', labelCN: '近期未来', description: '即将到来的影响与事件' },
      { key: 'self', label: 'Self', labelCN: '自我认知', description: '你如何看待自己与这个局势' },
      { key: 'environment', label: 'Environment', labelCN: '外部环境', description: '周围人与环境的影响' },
      { key: 'hopes_fears', label: 'Hopes & Fears', labelCN: '希望与恐惧', description: '你内心深处的期盼与担忧' },
      { key: 'outcome', label: 'Outcome', labelCN: '最终结果', description: '在当前轨迹上最可能的结果' },
    ],
  },
  {
    id: 'daily',
    name: 'Daily Draw',
    nameCN: '每日一牌',
    description: '每天清晨，让一张牌为你的一天定调',
    cardCount: 1,
    icon: '☀️',
    positions: [
      { key: 'daily', label: 'Daily Guidance', labelCN: '今日指引', description: '今天的宇宙信息与能量指引' },
    ],
  },
];

export function getSpreadById(id: string): SpreadType | undefined {
  return spreads.find(s => s.id === id);
}
