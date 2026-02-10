import { NextRequest, NextResponse } from "next/server";
import {
  createTokenInfo,
  createFeeShareConfig,
  createLaunchTransaction,
  sendTransaction,
  getPartnerConfigKey,
} from "@/lib/bags";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { step } = body;

    if (step === "create-info") {
      // Step 1: Create token info and metadata
      const formData = new FormData();
      formData.append("name", body.name);
      formData.append("symbol", body.symbol);
      formData.append("description", body.description);
      if (body.imageUrl) formData.append("imageUrl", body.imageUrl);
      if (body.twitter) formData.append("twitter", body.twitter);
      if (body.telegram) formData.append("telegram", body.telegram);
      if (body.website) formData.append("website", body.website);

      const info = await createTokenInfo(formData);
      return NextResponse.json({ success: true, data: info });
    }

    if (step === "create-config") {
      // Step 2: Create fee share configuration
      // ALWAYS attach partner config key for royalties
      const partnerConfigKey = getPartnerConfigKey();

      // Build feeClaimers from the request
      // If custom feeClaimers provided, use them; otherwise default to launcher getting 100%
      const feeClaimers = body.feeClaimers || [
        { user: body.wallet, userBps: 10000 },
      ];

      const configParams: Parameters<typeof createFeeShareConfig>[0] = {
        payer: body.wallet,
        baseMint: body.tokenMint,
        feeClaimers,
      };

      // ALWAYS inject partner config for platform royalties
      if (partnerConfigKey) {
        configParams.partner = partnerConfigKey;
        configParams.partnerConfig = partnerConfigKey;
      }

      const config = await createFeeShareConfig(configParams);
      return NextResponse.json({ success: true, data: config });
    }

    if (step === "create-launch-tx") {
      // Step 3: Create launch transaction
      const tx = await createLaunchTransaction({
        metadataUrl: body.metadataUrl,
        tokenMint: body.tokenMint,
        wallet: body.wallet,
        initialBuyLamports: body.initialBuyLamports || 0,
        configKey: body.configKey,
      });
      return NextResponse.json({ success: true, data: tx });
    }

    if (step === "send-tx") {
      // Step 4: Submit signed transaction via Bags API
      const sig = await sendTransaction(body.transaction);
      return NextResponse.json({ success: true, data: sig });
    }

    return NextResponse.json(
      { success: false, error: "Unknown step" },
      { status: 400 }
    );
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Launch step failed";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
