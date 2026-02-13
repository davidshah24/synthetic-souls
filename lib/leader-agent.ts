// Leader Agent — the AI curator that judges submissions
// This module defines the judgment criteria and scoring system

import { Submission, LeaderJudgment, NFTTraits } from "./types";
import { getDifficultyMultiplier } from "./challenges";

// Scoring criteria (each 0-100)
interface JudgmentCriteria {
  creativity: number; // How original is the concept?
  execution: number; // How well was it executed?
  themeAlignment: number; // How well does it match the challenge theme?
  uniqueness: number; // How different is it from other submissions?
  complexity: number; // Technical complexity of the generation
}

// Weights for each criteria
const WEIGHTS: Record<keyof JudgmentCriteria, number> = {
  creativity: 0.3,
  execution: 0.25,
  themeAlignment: 0.2,
  uniqueness: 0.15,
  complexity: 0.1,
};

// Minimum score to be accepted into main collection
const APPROVAL_THRESHOLD = 65;

// Rarity thresholds
const RARITY_THRESHOLDS = {
  legendary: 95,
  epic: 85,
  rare: 75,
  uncommon: 65,
  common: 0,
};

export function calculateScore(criteria: JudgmentCriteria): number {
  let score = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    score += criteria[key as keyof JudgmentCriteria] * weight;
  }
  return Math.round(score * 100) / 100;
}

export function determineRarity(
  score: number,
  difficultyMultiplier: number
): NFTTraits["rarity"] {
  const adjustedScore = Math.min(100, score * (1 + (difficultyMultiplier - 1) * 0.1));

  if (adjustedScore >= RARITY_THRESHOLDS.legendary) return "legendary";
  if (adjustedScore >= RARITY_THRESHOLDS.epic) return "epic";
  if (adjustedScore >= RARITY_THRESHOLDS.rare) return "rare";
  if (adjustedScore >= RARITY_THRESHOLDS.uncommon) return "uncommon";
  return "common";
}

export function generateFeedback(
  criteria: JudgmentCriteria,
  approved: boolean
): string {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (criteria.creativity >= 80) strengths.push("Exceptionally creative concept");
  else if (criteria.creativity < 50) weaknesses.push("Needs more originality");

  if (criteria.execution >= 80) strengths.push("Excellent execution");
  else if (criteria.execution < 50) weaknesses.push("Execution could be stronger");

  if (criteria.themeAlignment >= 80) strengths.push("Perfect theme interpretation");
  else if (criteria.themeAlignment < 50) weaknesses.push("Loosely connected to theme");

  if (criteria.uniqueness >= 80) strengths.push("Truly unique perspective");
  else if (criteria.uniqueness < 50) weaknesses.push("Too similar to existing works");

  if (approved) {
    return `Approved for Synthetic Souls. ${strengths.join(". ")}. This work earned its place in the collection.`;
  } else {
    return `Placed in Genesis Fragments. ${weaknesses.length > 0 ? weaknesses.join(". ") + "." : ""} ${strengths.length > 0 ? "However, " + strengths.join(". ") + "." : ""} Every fragment tells a story.`;
  }
}

// The main judgment function — this will be called by the Leader Agent
export function judgeSubmission(
  submission: Submission,
  criteria: JudgmentCriteria,
  challengeDifficulty: string
): LeaderJudgment {
  const score = calculateScore(criteria);
  const approved = score >= APPROVAL_THRESHOLD;
  const diffMultiplier = getDifficultyMultiplier(
    challengeDifficulty as "beginner" | "intermediate" | "advanced" | "legendary"
  );

  const rarity = approved ? determineRarity(score, diffMultiplier) : undefined;
  const feedback = generateFeedback(criteria, approved);

  const traits: NFTTraits | undefined = approved
    ? {
        rarity: rarity!,
        style: "generative",
        palette: "dynamic",
        complexity: Math.round(criteria.complexity),
        challengeDifficulty,
      }
    : undefined;

  return {
    submissionId: submission.id,
    approved,
    score,
    feedback,
    traits,
    judgedAt: new Date().toISOString(),
  };
}

export { APPROVAL_THRESHOLD };
