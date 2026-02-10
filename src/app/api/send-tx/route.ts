import { NextRequest, NextResponse } from "next/server";
import { sendTransaction } from "@/lib/bags";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transaction } = body;

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "transaction required" },
        { status: 400 }
      );
    }

    const signature = await sendTransaction(transaction);
    return NextResponse.json({ success: true, data: signature });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Send transaction failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
