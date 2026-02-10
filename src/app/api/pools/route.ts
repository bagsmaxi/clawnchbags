import { NextRequest, NextResponse } from "next/server";
import { getPools } from "@/lib/bags";

export async function GET(req: NextRequest) {
  try {
    const onlyMigrated =
      req.nextUrl.searchParams.get("onlyMigrated") === "true";
    const pools = await getPools(onlyMigrated);
    return NextResponse.json({ success: true, data: pools });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Failed to fetch pools";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
