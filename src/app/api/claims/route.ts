import { NextRequest, NextResponse } from "next/server";
import { getClaimablePositions, getClaimTransactions } from "@/lib/bags";

export async function GET(req: NextRequest) {
  try {
    const wallet = req.nextUrl.searchParams.get("wallet");
    if (!wallet) {
      return NextResponse.json(
        { success: false, error: "wallet param required" },
        { status: 400 }
      );
    }

    const positions = await getClaimablePositions(wallet);
    return NextResponse.json({ success: true, data: positions });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Failed to fetch claimable positions";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { feeClaimer, tokenMint } = body;

    if (!feeClaimer || !tokenMint) {
      return NextResponse.json(
        { success: false, error: "feeClaimer and tokenMint required" },
        { status: 400 }
      );
    }

    const result = await getClaimTransactions(feeClaimer, tokenMint);
    return NextResponse.json({ success: true, data: result });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Failed to get claim transactions";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
