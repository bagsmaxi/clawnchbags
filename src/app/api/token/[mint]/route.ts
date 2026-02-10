import { NextRequest, NextResponse } from "next/server";
import { getTokenLifetimeFees, getTokenCreators } from "@/lib/bags";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ mint: string }> }
) {
  try {
    const { mint } = await params;

    const [lifetimeFees, creators] = await Promise.allSettled([
      getTokenLifetimeFees(mint),
      getTokenCreators(mint),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        tokenMint: mint,
        lifetimeFees:
          lifetimeFees.status === "fulfilled" ? lifetimeFees.value : "0",
        creators:
          creators.status === "fulfilled" ? creators.value : [],
      },
    });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Failed to fetch token data";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
