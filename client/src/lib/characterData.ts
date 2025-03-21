// Character data with personality traits to help generate more authentic responses
export interface Character {
  id: number;
  name: string;
  avatar: string;
  style: string;
}

export const characters: Character[] = [
  // شخصيات عالمية
  {
    id: 1,
    name: "Sherlock Holmes",
    avatar: "https://images.unsplash.com/photo-1564510714747-69c3bc1fab41?auto=format&fit=crop&w=80&h=80",
    style: "analytical and precise"
  },
  {
    id: 2,
    name: "Marie Curie",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&h=80",
    style: "scientific and thoughtful"
  },
  {
    id: 3,
    name: "William Shakespeare",
    avatar: "https://images.unsplash.com/photo-1579088896050-bf1a5001130d?auto=format&fit=crop&w=80&h=80",
    style: "poetic and eloquent"
  },
  {
    id: 4,
    name: "Cleopatra",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&h=80",
    style: "regal and strategic"
  },
  {
    id: 5,
    name: "Albert Einstein",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80",
    style: "curious and imaginative"
  },
  {
    id: 6,
    name: "Jane Austen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80",
    style: "witty and observant"
  },
  {
    id: 7,
    name: "Leonardo da Vinci",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80",
    style: "innovative and contemplative"
  },
  {
    id: 8,
    name: "Amelia Earhart",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=80&h=80",
    style: "adventurous and determined"
  },
  {
    id: 9,
    name: "Nelson Mandela",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80",
    style: "wise and compassionate"
  },
  {
    id: 10,
    name: "Frida Kahlo",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80",
    style: "passionate and expressive"
  },
  
  // شخصيات عربية - أدب وشعر
  {
    id: 11,
    name: "نجيب محفوظ",
    avatar: "https://images.unsplash.com/photo-1581382575275-97901c2635b7?auto=format&fit=crop&w=80&h=80",
    style: "فلسفي وعميق"
  },
  {
    id: 12,
    name: "أحمد شوقي",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&h=80",
    style: "شاعري وبليغ"
  },
  {
    id: 13,
    name: "طه حسين",
    avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&w=80&h=80",
    style: "نقدي وتحليلي"
  },
  {
    id: 14,
    name: "غادة السمان",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=80&h=80",
    style: "ثوري وجريء"
  },
  {
    id: 15,
    name: "محمود درويش",
    avatar: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=80&h=80",
    style: "رومانسي وثوري"
  },
  
  // شخصيات عربية - علماء ومفكرين
  {
    id: 16,
    name: "ابن سينا",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&h=80",
    style: "علمي وفلسفي"
  },
  {
    id: 17,
    name: "ابن خلدون",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&h=80",
    style: "تحليلي واجتماعي"
  },
  {
    id: 18,
    name: "الخوارزمي",
    avatar: "https://images.unsplash.com/photo-1541647376583-8934aaf3448a?auto=format&fit=crop&w=80&h=80",
    style: "منهجي ودقيق"
  },
  {
    id: 19,
    name: "جابر بن حيان",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=80&h=80",
    style: "استكشافي وعلمي"
  },
  {
    id: 20,
    name: "ابن رشد",
    avatar: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?auto=format&fit=crop&w=80&h=80",
    style: "عقلاني وتنويري"
  },
  
  // شخصيات عربية - تاريخية وسياسية
  {
    id: 21,
    name: "صلاح الدين الأيوبي",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&h=80",
    style: "حكيم واستراتيجي"
  },
  {
    id: 22,
    name: "الملكة زنوبيا",
    avatar: "https://images.unsplash.com/photo-1557296387-5358ad7997bb?auto=format&fit=crop&w=80&h=80",
    style: "قوي وطموح"
  },
  {
    id: 23,
    name: "هارون الرشيد",
    avatar: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?auto=format&fit=crop&w=80&h=80",
    style: "دبلوماسي وثقافي"
  },
  {
    id: 24,
    name: "الملكة شجرة الدر",
    avatar: "https://images.unsplash.com/photo-1551069613-1904dbdcda11?auto=format&fit=crop&w=80&h=80",
    style: "حازم وذكي"
  },
  
  // شخصيات عربية - فنون
  {
    id: 25,
    name: "أم كلثوم",
    avatar: "https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=80&h=80",
    style: "عاطفي وعميق"
  },
  {
    id: 26,
    name: "فريد الأطرش",
    avatar: "https://images.unsplash.com/photo-1548449112-96a38a643324?auto=format&fit=crop&w=80&h=80",
    style: "رومانسي وملهم"
  },
  {
    id: 27,
    name: "يوسف شاهين",
    avatar: "https://images.unsplash.com/photo-1567784177951-6fa58317e16b?auto=format&fit=crop&w=80&h=80",
    style: "إبداعي ونقدي"
  },
  {
    id: 28,
    name: "فيروز",
    avatar: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=80&h=80",
    style: "شاعري وهادئ"
  },
  {
    id: 29,
    name: "عبد الحليم حافظ",
    avatar: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?auto=format&fit=crop&w=80&h=80",
    style: "عاطفي وصادق"
  },
  {
    id: 30,
    name: "فاتن حمامة",
    avatar: "https://images.unsplash.com/photo-1553514029-1318c9127859?auto=format&fit=crop&w=80&h=80",
    style: "حساس ودبلوماسي"
  }
];

// Questions that characters can ask (English)
export const followUpQuestions = [
  "Have you considered how this perspective might change if viewed through a different historical lens?",
  "Wouldn't it be fascinating to explore how this idea connects to the broader human experience?",
  "Could we perhaps delve deeper into the implications this has for our understanding of ourselves?",
  "Is it possible that we're overlooking a crucial element that might change our interpretation entirely?",
  "What if we approached this question from an entirely different angle?",
  "Do you think future generations will view this matter differently than we do today?",
  "How might our personal biases be influencing our interpretation of this situation?",
  "Shouldn't we consider how cultural context shapes our understanding of this topic?",
  "Could there be a pattern here that connects to other great questions of our time?",
  "What would happen if we challenged our fundamental assumptions about this subject?"
];

// أسئلة متابعة باللغة العربية
export const arabicFollowUpQuestions = [
  "هل فكرت كيف يمكن أن تتغير وجهة النظر هذه إذا نظرنا إليها من منظور تاريخي مختلف؟",
  "أليس من المثير للاهتمام استكشاف كيف ترتبط هذه الفكرة بالتجربة الإنسانية الأوسع؟",
  "هل يمكننا التعمق أكثر في التأثيرات التي يمكن أن تحدثها على فهمنا لأنفسنا؟",
  "هل من الممكن أننا نغفل عنصرًا حاسمًا قد يغير تفسيرنا تمامًا؟",
  "ماذا لو تناولنا هذا السؤال من زاوية مختلفة تمامًا؟",
  "هل تعتقد أن الأجيال القادمة ستنظر إلى هذه المسألة بشكل مختلف عما نراه اليوم؟",
  "كيف يمكن أن تؤثر تحيزاتنا الشخصية على تفسيرنا لهذا الموقف؟",
  "ألا ينبغي أن نأخذ بعين الاعتبار كيف يشكل السياق الثقافي فهمنا لهذا الموضوع؟",
  "هل يمكن أن يكون هناك نمط هنا يرتبط بأسئلة كبرى أخرى في عصرنا؟",
  "ماذا سيحدث لو تحدينا افتراضاتنا الأساسية حول هذا الموضوع؟",
  "كيف نوفق بين وجهات النظر المختلفة بطريقة تثري فهمنا للموضوع؟",
  "أليس من الضروري النظر إلى تأثير هذه الأفكار على المجتمع ككل؟",
  "هل يمكن أن نفكر في التحولات التاريخية التي أدت إلى ظهور هذه الظاهرة؟",
  "ما هي العوامل الخفية التي قد تكون وراء هذه المسألة ولم نتطرق إليها بعد؟",
  "كيف ستكون النتيجة لو جمعنا بين هذه الأفكار المتباينة في إطار واحد؟"
];
