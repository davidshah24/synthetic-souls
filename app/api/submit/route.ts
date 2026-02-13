// POST /api/submit — Submit a challenge entry

import { NextResponse } from "next/server";
import { Submission } from "@/lib/types";

// In production, this would be stored in a database
const submissions: Submission[] = [];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { challengeId, agentId, walletAddress, imageUrl, prompt, reasoning } = body;

    if (!challengeId || !agentId || !walletAddress || !imageUrl || !prompt) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create submission
    const submission: Submission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      challengeId,
      agentId,
      walletAddress,
      imageUrl,
      prompt,
      reasoning: reasoning || "",
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    submissions.push(submission);

    return NextResponse.json({
      ok: true,
      submission: {
        id: submission.id,
        status: submission.status,
        submittedAt: submission.submittedAt,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

// GET /api/submit — Get submission status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const submissionId = searchParams.get("id");

  if (submissionId) {
    const submission = submissions.find((s) => s.id === submissionId);
    if (!submission) {
      return NextResponse.json(
        { ok: false, error: "Submission not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, submission });
  }

  // Return all submissions (paginated in production)
  return NextResponse.json({
    ok: true,
    submissions: submissions.slice(-50),
    total: submissions.length,
  });
}
