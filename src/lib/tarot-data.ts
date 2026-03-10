export interface TarotCard {
  id: number;
  name: string;
  nameCN: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  number?: number;
  image: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
}

const majorArcana: TarotCard[] = [
  { id: 0, name: "The Fool", nameCN: "愚者", arcana: "major", image: "/cards/major/ar00.jpg", keywords: ["新开始", "自由", "冒险", "天真"], uprightMeaning: "新的旅程即将开始，带着信任与勇气前行。拥抱未知，保持赤子之心。", reversedMeaning: "鲁莽行事，缺乏准备。需要更多思考，警惕冲动决定。" },
  { id: 1, name: "The Magician", nameCN: "魔术师", arcana: "major", image: "/cards/major/ar01.jpg", keywords: ["创造力", "意志力", "技巧", "资源"], uprightMeaning: "你拥有实现目标所需的一切资源。发挥创造力，将想法变为现实。", reversedMeaning: "才能被浪费，计划缺乏行动力。警惕欺骗与操纵。" },
  { id: 2, name: "The High Priestess", nameCN: "女祭司", arcana: "major", image: "/cards/major/ar02.jpg", keywords: ["直觉", "智慧", "神秘", "内在声音"], uprightMeaning: "倾听内心的声音，直觉会引导你找到答案。深层的智慧正在浮现。", reversedMeaning: "忽略直觉，过于依赖理性。内心的声音被压抑，需要静心聆听。" },
  { id: 3, name: "The Empress", nameCN: "女皇", arcana: "major", image: "/cards/major/ar03.jpg", keywords: ["丰饶", "母性", "自然", "富足"], uprightMeaning: "丰饶与创造力的时期。享受生活的美好，关注身心的滋养。", reversedMeaning: "创造力受阻，过度依赖他人。需要重新连接自己的内在力量。" },
  { id: 4, name: "The Emperor", nameCN: "皇帝", arcana: "major", image: "/cards/major/ar04.jpg", keywords: ["权威", "结构", "稳定", "领导力"], uprightMeaning: "建立秩序与规则的时候。以坚定的意志和清晰的头脑引领前行。", reversedMeaning: "过于专制，控制欲强。僵化的思维需要灵活变通。" },
  { id: 5, name: "The Hierophant", nameCN: "教皇", arcana: "major", image: "/cards/major/ar05.jpg", keywords: ["传统", "信仰", "教导", "指引"], uprightMeaning: "遵循传统智慧，寻求精神指引。向有经验的人学习。", reversedMeaning: "打破常规，挑战权威。独立思考比盲从更重要。" },
  { id: 6, name: "The Lovers", nameCN: "恋人", arcana: "major", image: "/cards/major/ar06.jpg", keywords: ["爱情", "选择", "和谐", "价值观"], uprightMeaning: "重要的选择摆在面前。跟随内心的真爱，追求灵魂的和谐。", reversedMeaning: "关系失衡，价值观冲突。需要重新审视内心的真正渴望。" },
  { id: 7, name: "The Chariot", nameCN: "战车", arcana: "major", image: "/cards/major/ar07.jpg", keywords: ["意志力", "胜利", "决心", "行动"], uprightMeaning: "凭借坚定的意志驱动前进。克服障碍，取得胜利就在眼前。", reversedMeaning: "方向不明，失去控制。内心的冲突需要先解决。" },
  { id: 8, name: "Strength", nameCN: "力量", arcana: "major", image: "/cards/major/ar08.jpg", keywords: ["内在力量", "勇气", "耐心", "慈悲"], uprightMeaning: "真正的力量来自内心。以温柔和耐心面对挑战，你比想象中更强大。", reversedMeaning: "自我怀疑，缺乏信心。需要重新找到内在的勇气。" },
  { id: 9, name: "The Hermit", nameCN: "隐者", arcana: "major", image: "/cards/major/ar09.jpg", keywords: ["独处", "反省", "智慧", "寻找"], uprightMeaning: "适合独处与内省的时期。在安静中寻找内心的明灯。", reversedMeaning: "过度孤立，拒绝帮助。是时候走出象牙塔，与世界重新连接。" },
  { id: 10, name: "Wheel of Fortune", nameCN: "命运之轮", arcana: "major", image: "/cards/major/ar10.jpg", keywords: ["命运", "转变", "机遇", "循环"], uprightMeaning: "命运之轮正在转动，好运即将到来。把握机遇，顺应变化。", reversedMeaning: "运势低迷，但这只是暂时的。逆境终将过去，耐心等待转机。" },
  { id: 11, name: "Justice", nameCN: "正义", arcana: "major", image: "/cards/major/ar11.jpg", keywords: ["公正", "真相", "因果", "平衡"], uprightMeaning: "公正与真相会浮出水面。对待事物要客观公正，种什么因得什么果。", reversedMeaning: "不公正的对待，逃避责任。需要面对真相，承担后果。" },
  { id: 12, name: "The Hanged Man", nameCN: "倒吊人", arcana: "major", image: "/cards/major/ar12.jpg", keywords: ["放下", "等待", "牺牲", "新视角"], uprightMeaning: "换个角度看问题。有时候放手和等待，反而能获得新的启示。", reversedMeaning: "无谓的牺牲，拖延不决。停止纠结，该行动的时候就行动。" },
  { id: 13, name: "Death", nameCN: "死神", arcana: "major", image: "/cards/major/ar13.jpg", keywords: ["结束", "转变", "新生", "放下"], uprightMeaning: "旧的篇章正在结束，新的篇章即将开启。拥抱改变，这是成长的必经之路。", reversedMeaning: "抗拒改变，不愿放手。拒绝结束只会让痛苦延长。" },
  { id: 14, name: "Temperance", nameCN: "节制", arcana: "major", image: "/cards/major/ar14.jpg", keywords: ["平衡", "调和", "耐心", "适度"], uprightMeaning: "保持平衡与适度。耐心地调和各方面的力量，和谐之道带来内心的平静。", reversedMeaning: "失去平衡，极端行为。过度或不足都不可取，需要重新找到中道。" },
  { id: 15, name: "The Devil", nameCN: "恶魔", arcana: "major", image: "/cards/major/ar15.jpg", keywords: ["束缚", "欲望", "物质", "阴影"], uprightMeaning: "被欲望或恐惧所束缚。认清那些限制你的锁链，其实你随时可以挣脱。", reversedMeaning: "开始挣脱束缚，重获自由。直面阴影面，才能真正解放自己。" },
  { id: 16, name: "The Tower", nameCN: "塔", arcana: "major", image: "/cards/major/ar16.jpg", keywords: ["突变", "崩塌", "觉醒", "真相"], uprightMeaning: "突如其来的变故打破旧有的结构。虽然震撼，但这是必要的觉醒。", reversedMeaning: "灾难被避免或延迟，但根本问题仍在。主动面对比被动承受更好。" },
  { id: 17, name: "The Star", nameCN: "星星", arcana: "major", image: "/cards/major/ar17.jpg", keywords: ["希望", "灵感", "治愈", "宁静"], uprightMeaning: "风暴过后的宁静与希望。宇宙在指引你，保持信心，一切会好起来的。", reversedMeaning: "失去信心，感到迷茫。但希望从未消失，只是被暂时遮蔽。" },
  { id: 18, name: "The Moon", nameCN: "月亮", arcana: "major", image: "/cards/major/ar18.jpg", keywords: ["幻觉", "潜意识", "不安", "直觉"], uprightMeaning: "事情可能不如表面看到的那样。注意潜意识的信号，穿越迷雾见真相。", reversedMeaning: "走出迷惑，真相开始清晰。恐惧正在消退，信任你的直觉。" },
  { id: 19, name: "The Sun", nameCN: "太阳", arcana: "major", image: "/cards/major/ar19.jpg", keywords: ["喜悦", "成功", "活力", "光明"], uprightMeaning: "阳光普照，充满喜悦与活力。成功与幸福正在向你走来，尽情享受。", reversedMeaning: "快乐被延迟但不会缺席。保持积极心态，阳光终会穿透云层。" },
  { id: 20, name: "Judgement", nameCN: "审判", arcana: "major", image: "/cards/major/ar20.jpg", keywords: ["觉醒", "重生", "反思", "召唤"], uprightMeaning: "灵魂的觉醒时刻。回顾过往，接受召唤，准备迎接全新的人生阶段。", reversedMeaning: "自我怀疑，错失觉醒的机会。不要害怕改变，听从内心的召唤。" },
  { id: 21, name: "The World", nameCN: "世界", arcana: "major", image: "/cards/major/ar21.jpg", keywords: ["完成", "圆满", "旅程", "整合"], uprightMeaning: "一个重要的周期圆满完成。你已经走过了完整的旅程，成就非凡。", reversedMeaning: "距离目标还差最后一步。不要在终点前放弃，坚持到底。" },
];

function createMinorCards(
  suit: 'wands' | 'cups' | 'swords' | 'pentacles',
  suitCN: string,
  startId: number,
  suitData: { keywords: string[]; upright: string; reversed: string }[]
): TarotCard[] {
  const names = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
  const namesCN = ['王牌', '二', '三', '四', '五', '六', '七', '八', '九', '十', '侍从', '骑士', '王后', '国王'];
  const fileNames = ['ace', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'page', 'knight', 'queen', 'king'];

  return names.map((name, i) => ({
    id: startId + i,
    name: `${name} of ${suit.charAt(0).toUpperCase() + suit.slice(1)}`,
    nameCN: `${suitCN}${namesCN[i]}`,
    arcana: 'minor' as const,
    suit,
    number: i + 1,
    image: `/cards/minor/${suit}/${fileNames[i]}.jpg`,
    keywords: suitData[i].keywords,
    uprightMeaning: suitData[i].upright,
    reversedMeaning: suitData[i].reversed,
  }));
}

const wandsData = [
  { keywords: ["灵感", "新机遇", "创造力"], upright: "新的灵感与机遇降临，充满创造的能量。抓住这股热情，勇敢开始。", reversed: "延迟的开始，缺乏方向。灵感虽有但行动力不足。" },
  { keywords: ["计划", "决策", "远见"], upright: "站在十字路口，掌握全局。制定计划，大胆展望未来的可能。", reversed: "犹豫不决，害怕做出选择。过度计划反而阻碍了行动。" },
  { keywords: ["拓展", "远见", "领导力"], upright: "你的努力正在结出果实，视野在扩展。领导力得到认可，继续前行。", reversed: "缺乏远见，计划受阻。需要重新审视方向。" },
  { keywords: ["庆祝", "和谐", "家园"], upright: "值得庆祝的时刻到来了。稳定与和谐的基础已经建立。", reversed: "不稳定感，缺乏归属。内心的不安需要关注。" },
  { keywords: ["竞争", "冲突", "挑战"], upright: "面临竞争与挑战，但这能激发你的潜能。通过努力证明自己。", reversed: "不必要的争斗，内耗严重。选择你的战场，有些争执不值得参与。" },
  { keywords: ["胜利", "认可", "自信"], upright: "公开的认可与胜利。你的努力得到了应有的赞赏，享受荣誉时刻。", reversed: "缺乏自信，认可被延迟。不要被外界的评价左右自我价值。" },
  { keywords: ["勇气", "坚守", "优势"], upright: "面对挑战时坚守立场。你占据优势，保持勇气就能赢得胜利。", reversed: "压力过大，难以坚持。适时退让并非软弱，策略性休息也是智慧。" },
  { keywords: ["速度", "行动", "信息"], upright: "事情正在快速推进。消息即将到来，保持敏锐，迅速行动。", reversed: "延迟和阻碍。急于求成反而会出错，耐心等待时机。" },
  { keywords: ["坚韧", "警惕", "毅力"], upright: "虽然疲惫，但不要放弃。你已经走过了最难的路段，坚持就是胜利。", reversed: "过度紧张，拒绝帮助。适当放下防备，接受支持。" },
  { keywords: ["负担", "责任", "压力"], upright: "肩上的责任很重，但你有能力承担。学会委托和分担。", reversed: "放下不属于你的负担。你不需要扛起所有的责任。" },
  { keywords: ["热情", "探索", "消息"], upright: "充满热情的探索者带来好消息。追随你的好奇心，大胆尝试新事物。", reversed: "缺乏方向的热情。需要把分散的精力集中到一个目标上。" },
  { keywords: ["冒险", "热情", "行动力"], upright: "充满行动力，勇敢追求目标。热情是你最大的武器，大胆前行。", reversed: "冲动鲁莽，缺乏耐心。在行动前需要更多思考。" },
  { keywords: ["独立", "决心", "魅力"], upright: "自信而独立，散发着自然的魅力。以决心和热情引领生活。", reversed: "过于强势，忽略他人感受。平衡自信与谦逊。" },
  { keywords: ["领袖", "愿景", "企业家"], upright: "天生的领袖，拥有宏大的愿景。以热情和智慧带领团队前进。", reversed: "独断专行，目标不切实际。需要倾听不同的声音。" },
];

const cupsData = [
  { keywords: ["爱", "新感情", "直觉"], upright: "情感的新开始，心灵之杯溢满了爱。新的感情或创意灵感正在涌现。", reversed: "情感被压抑，爱的能量受阻。需要先学会爱自己。" },
  { keywords: ["伙伴", "吸引", "统一"], upright: "美好的连接正在形成。两颗心的交融，建立在互相尊重的基础上。", reversed: "关系中的不平衡，沟通障碍。需要真诚地面对彼此。" },
  { keywords: ["庆祝", "友谊", "社交"], upright: "欢聚与庆祝的时刻。珍惜身边的朋友，共同分享喜悦。", reversed: "过度放纵，虚假的社交。分辨真心朋友与酒肉之交。" },
  { keywords: ["冷漠", "内省", "不满"], upright: "对现状感到不满或倦怠。审视内心，可能错过了身边的机遇。", reversed: "重新觉醒，发现新的可能。从冷漠中走出，重燃热情。" },
  { keywords: ["失落", "悲伤", "遗憾"], upright: "经历失去与悲伤。虽然痛苦，但请注意身后仍有两杯站立不倒。", reversed: "从悲伤中走出，接受失去。新的希望正在地平线上升起。" },
  { keywords: ["怀旧", "童真", "回忆"], upright: "美好的回忆带来温暖。珍惜纯真的情感，找回心中的那份美好。", reversed: "沉溺于过去，无法前行。是时候活在当下，创造新的回忆。" },
  { keywords: ["幻想", "选择", "白日梦"], upright: "太多的幻想与选择让人眼花缭乱。分辨现实与幻觉，做出务实的决定。", reversed: "从幻想回归现实。开始脚踏实地，专注于可行的目标。" },
  { keywords: ["放弃", "离开", "寻求"], upright: "勇敢地离开不再满足你的事物。虽然痛苦，但更好的在前方等着你。", reversed: "漫无目的的逃避。面对问题比逃跑更需要勇气。" },
  { keywords: ["满足", "愿望成真", "富足"], upright: "心愿达成，物质与精神双丰收。满意地微笑，享受成果。", reversed: "贪婪不足，物质上满足但精神空虚。真正的满足来自内心。" },
  { keywords: ["幸福", "家庭", "和谐"], upright: "圆满的幸福降临。家庭和谐，情感丰盈，这是人生最美好的画面。", reversed: "家庭矛盾，短暂的不和。通过沟通和爱来修复关系。" },
  { keywords: ["创意", "浪漫", "梦想"], upright: "年轻的浪漫心灵，充满创意与情感。跟随直觉，表达真实的自己。", reversed: "情感不成熟，过于理想化。需要面对现实中的感情。" },
  { keywords: ["浪漫", "魅力", "理想主义"], upright: "浪漫的追求者带着爱意而来。跟随内心的感觉，不要害怕表达爱。", reversed: "情绪化，不切实际的浪漫。需要平衡理想与现实。" },
  { keywords: ["温柔", "关怀", "直觉"], upright: "温柔而富有洞察力。用爱和同理心去理解他人，你的关怀能治愈一切。", reversed: "情感过度敏感，容易受伤。需要设立健康的情感边界。" },
  { keywords: ["成熟", "慷慨", "情感智慧"], upright: "情感的成熟与智慧。以宽容的心待人，你的慷慨将收获尊重。", reversed: "情感操控，过度控制。真正的爱是给予自由，而非束缚。" },
];

const swordsData = [
  { keywords: ["真相", "清晰", "突破"], upright: "真相之剑切开迷雾。以清晰的思维突破困境，新的理解正在诞生。", reversed: "思维混乱，缺乏清晰度。在做决定前需要更多信息。" },
  { keywords: ["僵局", "平衡", "抉择"], upright: "面临两难的抉择。暂时的平衡需要打破，信任直觉做出选择。", reversed: "信息逐渐明朗，抉择变得清晰。不再回避困难的决定。" },
  { keywords: ["心碎", "悲伤", "分离"], upright: "经历心灵的伤痛与分离。痛苦虽深，但它也是治愈和成长的开始。", reversed: "伤痛开始愈合，准备放下。时间会治愈一切，给自己一些耐心。" },
  { keywords: ["休息", "恢复", "沉思"], upright: "需要暂停和休息的时刻。在恢复中积蓄力量，为下一步做准备。", reversed: "休息结束，准备重新出发。经过沉思后有了新的理解和方向。" },
  { keywords: ["冲突", "挫败", "争执"], upright: "虽然经历了挫败，但从中学到了重要的教训。有时候输了反而是赢了。", reversed: "从冲突中走出，选择和解。放下执念，才能真正前行。" },
  { keywords: ["过渡", "转变", "前行"], upright: "离开困境，向更好的方向前行。虽然旅程还在继续，但最艰难的已经过去。", reversed: "被困在原地，害怕改变。勇气就是害怕但依然选择前行。" },
  { keywords: ["策略", "隐秘", "智慧"], upright: "需要策略和智慧的时刻。有时候不正面冲突也能达成目标。", reversed: "计划被识破，缺乏策略。诚实往往是最好的策略。" },
  { keywords: ["限制", "困境", "无力感"], upright: "感觉被困住，四面受限。但请记住，束缚你的常常是自己的思维。", reversed: "开始找到出路，限制在松动。改变思维方式就能改变处境。" },
  { keywords: ["焦虑", "失眠", "担忧"], upright: "深夜的焦虑与担忧。但很多恐惧只存在于想象中，面对它们就会消散。", reversed: "焦虑开始缓解，找到了应对之道。学会与不确定性共处。" },
  { keywords: ["终结", "触底", "新生"], upright: "最黑暗的时刻，但黎明前的夜总是最深沉的。这是结束，也是新的开始。", reversed: "熬过了最难的时期。重生的力量正在积蓄，不要失去希望。" },
  { keywords: ["好奇", "机警", "真相"], upright: "敏锐的观察者，追寻真相。保持好奇心和警觉，真相往往隐藏在细节中。", reversed: "过度窥探，八卦多嘴。尊重他人的隐私和界限。" },
  { keywords: ["果断", "直接", "勇气"], upright: "快速而果断的行动者。以勇气和决心面对挑战，不要犹豫。", reversed: "过于激进，缺乏周全考虑。行动前先冷静思考。" },
  { keywords: ["独立", "洞察", "理性"], upright: "以智慧和理性做出判断。独立思考，不被情感左右决策。", reversed: "过于冷漠，缺乏同理心。理性与感性需要平衡。" },
  { keywords: ["权威", "真理", "公正"], upright: "以智慧和公正治理。用客观的标准衡量事物，坚持真理。", reversed: "滥用权力，不公正的判断。需要反思自己的立场是否客观。" },
];

const pentaclesData = [
  { keywords: ["财富", "机遇", "繁荣"], upright: "物质世界的新开始。财富与机遇之门正在打开，播下繁荣的种子。", reversed: "错失良机，财务计划需要调整。不要急于求成，稳扎稳打。" },
  { keywords: ["平衡", "适应", "多任务"], upright: "在多个事务间灵活周转。保持平衡感，以乐观的态度应对变化。", reversed: "失去平衡，手忙脚乱。需要优先排序，专注于最重要的事。" },
  { keywords: ["技艺", "合作", "成长"], upright: "你的技能正在精进。通过合作学习成长，匠心精神带来认可。", reversed: "工作质量下降，缺乏热情。重新找到工作的意义和乐趣。" },
  { keywords: ["安全", "控制", "守财"], upright: "珍视已有的成果，保持稳固的基础。适度的安全感让你安心。", reversed: "过于吝啬，害怕失去。慷慨分享反而能带来更多。" },
  { keywords: ["困难", "贫困", "孤立"], upright: "经济或精神上的困难时期。不要羞于寻求帮助，困难是暂时的。", reversed: "困境开始改善，找到了新的出路。保持希望，春天不远。" },
  { keywords: ["慷慨", "给予", "公平"], upright: "慷慨地给予和接受。公平的交换与分享带来内心的满足。", reversed: "给予和接受失衡。检视你的关系中是否存在单方面的付出。" },
  { keywords: ["耐心", "投资", "长期"], upright: "播下的种子需要时间成长。耐心等待，长期的投资终将有回报。", reversed: "对缓慢的进展感到焦虑。检视你的方向是否正确，做必要的调整。" },
  { keywords: ["工匠", "专注", "精进"], upright: "全身心投入工作，精益求精。你的专注和努力正在创造非凡的成果。", reversed: "工作变得机械化，缺乏热情。需要重新点燃对事业的激情。" },
  { keywords: ["独立", "丰收", "自给自足"], upright: "享受独立与丰收的果实。你已经建立了坚实的基础，品味成功的甜蜜。", reversed: "过度追求物质享受。别忘了精神世界同样需要滋养。" },
  { keywords: ["传承", "家族", "稳固"], upright: "家族的传承与积累。建立经得起时间考验的事业与关系。", reversed: "家庭矛盾影响财务。需要处理好人际关系中的利益问题。" },
  { keywords: ["学习", "机遇", "勤奋"], upright: "学习的好时机，新的技能将打开新的机遇。保持勤奋和好学的态度。", reversed: "学习进展缓慢，缺乏实际行动。纸上谈兵不如付诸实践。" },
  { keywords: ["稳重", "可靠", "坚持"], upright: "脚踏实地的行动者。以可靠和坚持赢得信任，慢慢来比较快。", reversed: "停滞不前，过于保守。需要在稳重和冒险之间找到平衡。" },
  { keywords: ["舒适", "安全", "富足"], upright: "物质上的丰盈与安全感。享受你创造的舒适生活，并与他人分享。", reversed: "过度追求物质安全。真正的富足包括精神的充实。" },
  { keywords: ["成功", "富足", "成就"], upright: "物质与精神的双重成就。你已经建立了一个富足的王国，享受成果。", reversed: "过于看重物质，忽略了精神需求。财富不是人生的唯一目标。" },
];

const wands = createMinorCards('wands', '权杖', 22, wandsData);
const cups = createMinorCards('cups', '圣杯', 36, cupsData);
const swords = createMinorCards('swords', '宝剑', 50, swordsData);
const pentacles = createMinorCards('pentacles', '星币', 64, pentaclesData);

export const tarotDeck: TarotCard[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles,
];

export function getCardById(id: number): TarotCard | undefined {
  return tarotDeck.find(card => card.id === id);
}

export function drawCards(count: number): { card: TarotCard; isReversed: boolean }[] {
  const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    card,
    isReversed: Math.random() < 0.3, // 30% chance of reversed
  }));
}

export function getMajorArcana(): TarotCard[] {
  return tarotDeck.filter(card => card.arcana === 'major');
}

export function getMinorArcana(): TarotCard[] {
  return tarotDeck.filter(card => card.arcana === 'minor');
}
