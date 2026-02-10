import { NextResponse } from "next/server";
import { getPartnerStats, getPartnerConfigKey } from "@/lib/bags";

export async function GET() {
  try {
    const partnerKey = getPartnerConfigKey();

    let partnerClaimed = "0";
    let partnerUnclaimed = "0";

    if (partnerKey) {
      try {
        const pStats = await getPartnerStats(partnerKey);
        partnerClaimed = pStats.claimedFees;
        partnerUnclaimed = pStats.unclaimedFees;
      } catch {
        // Partner stats may not be available yet
      }
    }

    // Total earned = claimed + unclaimed (both in lamports)
    const totalEarned = (
      BigInt(partnerClaimed || "0") + BigInt(partnerUnclaimed || "0")
    ).toString();

    return NextResponse.json({
      success: true,
      data: {
        partnerClaimed,
        partnerUnclaimed,
        totalEarned,
      },
    });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Failed to fetch stats";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
