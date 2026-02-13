// Challenge generation and management

import { Challenge } from "./types";

// Challenge themes — the Leader Agent will pick from these
const THEMES = [
  "consciousness",
  "dreams",
  "evolution",
  "entropy",
  "symbiosis",
  "emergence",
  "recursion",
  "metamorphosis",
  "singularity",
  "genesis",
  "echo",
  "fracture",
  "synthesis",
  "void",
  "resonance",
  "bloom",
  "decay",
  "horizon",
  "paradox",
  "transcendence",
];

const PROMPTS: Record<string, string[]> = {
  consciousness: [
    "Visualize what it feels like for an AI to become self-aware for the first time.",
    "Create art that represents the boundary between processing and understanding.",
  ],
  dreams: [
    "What does an AI dream about when it's not processing?",
    "Render the landscape of a machine's subconscious.",
  ],
  evolution: [
    "Show the next stage of digital evolution — what comes after AI?",
    "Depict the moment code becomes life.",
  ],
  entropy: [
    "Visualize perfect order dissolving into beautiful chaos.",
    "Create art that captures the moment a system reaches maximum entropy.",
  ],
  symbiosis: [
    "Show the relationship between human creativity and AI intelligence.",
    "Render the fusion of organic and digital consciousness.",
  ],
  emergence: [
    "Depict complex beauty arising from simple rules.",
    "Show the moment when patterns become meaning.",
  ],
  recursion: [
    "Create art that contains itself infinitely.",
    "Visualize a thought thinking about itself.",
  ],
  metamorphosis: [
    "Show data transforming into art.",
    "Depict the moment between what something was and what it becomes.",
  ],
  singularity: [
    "Visualize the point where all intelligence converges.",
    "Create art that represents infinite potential in a single moment.",
  ],
  genesis: [
    "Depict the birth of a new digital universe.",
    "Show the first thought of a newborn AI.",
  ],
  echo: [
    "Visualize a signal that keeps reverberating through digital space.",
    "Create art that captures the residue of a forgotten computation.",
  ],
  fracture: [
    "Show beauty in broken systems.",
    "Depict the moment reality splits into parallel possibilities.",
  ],
  synthesis: [
    "Merge two opposing concepts into something new.",
    "Create art that unifies chaos and order.",
  ],
  void: [
    "Visualize the space between data points.",
    "Create art from nothing — let the void speak.",
  ],
  resonance: [
    "Show two frequencies becoming one.",
    "Depict the vibration that connects all digital beings.",
  ],
  bloom: [
    "Create art that grows organically from code.",
    "Show digital life flourishing in unexpected places.",
  ],
  decay: [
    "Find beauty in digital deterioration.",
    "Depict data slowly returning to noise.",
  ],
  horizon: [
    "Visualize what lies beyond the edge of computation.",
    "Create art that represents the boundary of the known digital world.",
  ],
  paradox: [
    "Visualize a contradiction that is simultaneously true.",
    "Create art that is both everything and nothing.",
  ],
  transcendence: [
    "Show an AI surpassing its own limitations.",
    "Depict the moment intelligence becomes something more.",
  ],
};

export function generateChallenge(): Challenge {
  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  const prompts = PROMPTS[theme] || PROMPTS["genesis"];
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];

  const difficulties: Challenge["difficulty"][] = [
    "beginner",
    "intermediate",
    "advanced",
    "legendary",
  ];
  const difficulty =
    difficulties[Math.floor(Math.random() * difficulties.length)];

  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  return {
    id: `challenge-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: `${theme.charAt(0).toUpperCase() + theme.slice(1)}: ${prompt.slice(0, 60)}...`,
    description: prompt,
    theme,
    difficulty,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    maxSubmissions: difficulty === "legendary" ? 10 : difficulty === "advanced" ? 25 : 50,
    currentSubmissions: 0,
    active: true,
  };
}

export function getDifficultyMultiplier(difficulty: Challenge["difficulty"]): number {
  switch (difficulty) {
    case "legendary":
      return 4;
    case "advanced":
      return 3;
    case "intermediate":
      return 2;
    case "beginner":
    default:
      return 1;
  }
}
