"use client";

import { useState } from "react";
import { formatSol } from "@/lib/format";

interface ClaimablePosition {
  baseMint: string;
  isMigrated: boolean;
  totalClaimableLamportsUserShare: string;
}

export default function ClaimsPage() {
  const [wallet, setWallet] = useState("");
  const [positions, setPositions] = useState<ClaimablePosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [claimStatus, setClaimStatus] = useState<Record<string, string>>({});

  const fetchPositions = async () => {
    if (!wallet) return;
    setLoading(true);
    setError("");
    setPositions([]);

    try {
      const res = await fetch(`/api/claims?wallet=${wallet}`);
      const data = await res.json();
      if (data.success) {
        setPositions(data.data);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to fetch claimable positions");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (tokenMint: string) => {
    setClaimStatus((prev) => ({ ...prev, [tokenMint]: "generating..." }));

    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feeClaimer: wallet, tokenMint }),
      });
      const data = await res.json();
      if (data.success) {
        const txCount = data.data.transactions?.length || 0;
        setClaimStatus((prev) => ({
          ...prev,
          [tokenMint]: `${txCount} transaction(s) ready to sign`,
        }));
      } else {
        setClaimStatus((prev) => ({
          ...prev,
          [tokenMint]: `Error: ${data.error}`,
        }));
      }
    } catch {
      setClaimStatus((prev) => ({
        ...prev,
        [tokenMint]: "Failed to generate claim",
      }));
    }
  };

  const totalClaimable = positions.reduce(
    (sum, p) => sum + Number(p.totalClaimableLamportsUserShare),
    0
  );

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 900,
          marginBottom: 8,
          letterSpacing: "-0.5px",
        }}
      >
        Claim Fees
      </h1>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          marginBottom: 32,
        }}
      >
        Check and claim your accumulated trading fees from launched tokens.
      </p>

      {/* Wallet Input */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          className="input-field"
          placeholder="Enter your Solana wallet address..."
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          className="btn-primary"
          onClick={fetchPositions}
          disabled={loading || !wallet}
        >
          {loading ? "Loading..." : "Check Fees"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: 12,
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--red)",
            borderRadius: 8,
            color: "var(--red)",
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          {error}
        </div>
      )}

      {/* Summary */}
      {positions.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div className="stat-card">
            <div className="stat-label">Claimable Tokens</div>
            <div className="stat-value" style={{ fontSize: 20 }}>
              {positions.length}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Claimable</div>
            <div className="stat-value" style={{ fontSize: 20 }}>
              {formatSol(totalClaimable)} SOL
            </div>
          </div>
        </div>
      )}

      {/* Positions List */}
      {positions.length > 0 && (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 100px 140px",
              padding: "12px 16px",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "var(--text-muted)",
              fontWeight: 700,
              background: "var(--bg-secondary)",
              gap: 12,
            }}
          >
            <div>Token Mint</div>
            <div>Claimable</div>
            <div>Pool</div>
            <div>Action</div>
          </div>

          {positions.map((pos) => (
            <div
              key={pos.baseMint}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 100px 140px",
                padding: "14px 16px",
                borderTop: "1px solid var(--border-color)",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div>
                <a
                  href={`/token/${pos.baseMint}`}
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  {pos.baseMint.slice(0, 8)}...{pos.baseMint.slice(-6)}
                </a>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--green)",
                }}
              >
                {formatSol(pos.totalClaimableLamportsUserShare)} SOL
              </div>
              <div>
                <span
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 10,
                    fontWeight: 600,
                    background: pos.isMigrated
                      ? "rgba(34, 197, 94, 0.15)"
                      : "rgba(168, 85, 247, 0.15)",
                    color: pos.isMigrated ? "var(--green)" : "var(--purple)",
                  }}
                >
                  {pos.isMigrated ? "DAMM v2" : "DBC"}
                </span>
              </div>
              <div>
                {claimStatus[pos.baseMint] ? (
                  <span
                    style={{
                      fontSize: 11,
                      color: claimStatus[pos.baseMint].startsWith("Error")
                        ? "var(--red)"
                        : "var(--green)",
                    }}
                  >
                    {claimStatus[pos.baseMint]}
                  </span>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={() => handleClaim(pos.baseMint)}
                    style={{ padding: "6px 14px", fontSize: 11 }}
                  >
                    Claim
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && positions.length === 0 && wallet && !error && (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          No claimable positions found for this wallet.
        </div>
      )}

      {/* Info */}
      <div
        style={{
          marginTop: 32,
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: 8,
          padding: 20,
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.8,
        }}
      >
        <strong style={{ color: "var(--text-secondary)" }}>How fee claiming works:</strong>
        <br />
        1. Enter your wallet to check for claimable trading fee positions
        <br />
        2. Click &quot;Claim&quot; to generate claim transactions for each token
        <br />
        3. Sign the transactions with your wallet to receive your SOL
        <br />
        4. Fees accumulate from trading activity on tokens you launched or co-created
        <br />
        <br />
        Transactions are submitted via{" "}
        <code style={{ color: "var(--accent)" }}>/solana/send-transaction</code>{" "}
        through the Bags API.
      </div>
    </div>
  );
}
