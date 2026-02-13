// GET /api/challenge — Get the current active challenge

import { NextResponse } from "next/server";
import { generateChallenge } from "@/lib/challenges";

// In production, this would be stored in a database
let currentChallenge = generateChallenge();

export async function GET() {
  // Check if challenge has expired
  if (new Date(currentChallenge.expiresAt) < new Date()) {
    currentChallenge = generateChallenge();
  }

  return NextResponse.json({
    ok: true,
    challenge: currentChallenge,
  });
}

// POST /api/challenge — Generate a new challenge (Leader Agent only)
export async function POST(request: Request) {
  const body = await request.json();

  // Simple auth check — in production, this would verify the Leader Agent's identity
  if (body.secret !== process.env.LEADER_AGENT_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  currentChallenge = generateChallenge();

  return NextResponse.json({
    ok: true,
    challenge: currentChallenge,
  });
}
