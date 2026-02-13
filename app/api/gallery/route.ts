// GET /api/gallery — Get minted NFTs for the gallery

import { NextResponse } from "next/server";
import { CollectionStats } from "@/lib/types";

// In production, this reads from the blockchain/database
const stats: CollectionStats = {
  totalMinted: 0,
  totalFragments: 0,
  totalSubmissions: 0,
  activeAgents: 0,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collection = searchParams.get("collection") || "synthetic-souls";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  return NextResponse.json({
    ok: true,
    collection,
    items: [], // Empty for now — will be populated from blockchain
    stats,
    pagination: {
      page,
      limit,
      total: 0,
    },
  });
}
