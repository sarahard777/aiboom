// Character data with personality traits to help generate more authentic responses
export interface Character {
  id: number;
  name: string;
  avatar: string;
  style: string;
}

export const characters: Character[] = [
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
  }
];

// Questions that characters can ask
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
