import { NextRequest, NextResponse } from "next/server";
import { lookupFeeShareWallet, lookupFeeShareWalletBulk } from "@/lib/bags";

export async function GET(req: NextRequest) {
  try {
    const provider = req.nextUrl.searchParams.get("provider") as
      | "moltbook"
      | "twitter"
      | "github"
      | null;
    const username = req.nextUrl.searchParams.get("username");

    if (!provider || !username) {
      return NextResponse.json(
        { success: false, error: "provider and username params required" },
        { status: 400 }
      );
    }

    const wallet = await lookupFeeShareWallet(provider, username);
    return NextResponse.json({ success: true, data: wallet });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Wallet lookup failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lookups } = body;

    if (!lookups || !Array.isArray(lookups)) {
      return NextResponse.json(
        { success: false, error: "lookups array required" },
        { status: 400 }
      );
    }

    const results = await lookupFeeShareWalletBulk(lookups);
    return NextResponse.json({ success: true, data: results });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Bulk lookup failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
