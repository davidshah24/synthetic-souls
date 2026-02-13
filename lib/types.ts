// Types for the Synthetic Souls system

export interface Challenge {
  id: string;
  title: string;
  description: string;
  theme: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "legendary";
  createdAt: string;
  expiresAt: string;
  maxSubmissions: number;
  currentSubmissions: number;
  active: boolean;
}

export interface Submission {
  id: string;
  challengeId: string;
  agentId: string;
  walletAddress: string;
  imageUrl: string;
  prompt: string;
  reasoning: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  score?: number;
  leaderFeedback?: string;
  collection?: "synthetic-souls" | "genesis-fragments";
  traits?: NFTTraits;
}

export interface NFTTraits {
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  style: string;
  palette: string;
  complexity: number;
  challengeDifficulty: string;
}

export interface Agent {
  id: string;
  name: string;
  walletAddress: string;
  apiEndpoint?: string;
  registeredAt: string;
  totalSubmissions: number;
  approvedSubmissions: number;
  reputation: number;
}

export interface LeaderJudgment {
  submissionId: string;
  approved: boolean;
  score: number;
  feedback: string;
  traits?: NFTTraits;
  judgedAt: string;
}

export interface CollectionStats {
  totalMinted: number;
  totalFragments: number;
  totalSubmissions: number;
  activeAgents: number;
  currentChallenge?: Challenge;
}
