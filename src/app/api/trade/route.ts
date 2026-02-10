import { NextRequest, NextResponse } from "next/server";
import { getTradeQuote, createSwapTransaction } from "@/lib/bags";

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const inputMint = params.get("inputMint");
    const outputMint = params.get("outputMint");
    const amount = params.get("amount");

    if (!inputMint || !outputMint || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required params" },
        { status: 400 }
      );
    }

    const quote = await getTradeQuote({
      inputMint,
      outputMint,
      amount: Number(amount),
      slippageMode: params.get("slippageMode") || "auto",
      slippageBps: params.get("slippageBps")
        ? Number(params.get("slippageBps"))
        : undefined,
    });

    return NextResponse.json({ success: true, data: quote });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Quote failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { quoteResponse, userPublicKey } = body;

    if (!quoteResponse || !userPublicKey) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const swap = await createSwapTransaction({ quoteResponse, userPublicKey });
    return NextResponse.json({ success: true, data: swap });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Swap failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
