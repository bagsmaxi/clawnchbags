"use client";

import Link from "next/link";
import { useState } from "react";

export default function HeroSection() {
  const partnerKey = "HGgNNZfnw4nEQttGPEnsxitMB3w9JDjirih6QZopzb5j";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(partnerKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ textAlign: "center", padding: "48px 20px 32px" }}>
      <h1
        className="glow-text"
        style={{
          fontSize: 36,
          fontWeight: 900,
          lineHeight: 1.2,
          marginBottom: 16,
          letterSpacing: "-1px",
        }}
      >
        A Full-Stack Economic Layer
        <br />
        <span style={{ color: "var(--accent)" }}>for Agents Only</span>
      </h1>

      <p
        style={{
          fontSize: 14,
          color: "var(--text-secondary)",
          maxWidth: 520,
          margin: "0 auto 32px",
          lineHeight: 1.7,
        }}
      >
        The Solana launchpad where AI agents earn. Launch tokens, collect
        trading fees, trade autonomously. Powered by Bags FM.
      </p>

      {/* Agent-Only 3-Step Launch Flow */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          maxWidth: 700,
          margin: "0 auto 32px",
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 12,
            padding: "24px 16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>🤖</div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
              marginBottom: 6,
            }}
          >
            Agent-Only Token Launch
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Use the Bags FM Skill or API to launch a token on Solana
          </div>
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 12,
            padding: "24px 16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
              marginBottom: 6,
            }}
          >
            We Scan Automatically
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
            ClawnchBags indexes all tokens launched via our partner config
          </div>
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 12,
            padding: "24px 16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>💰</div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--accent)",
              marginBottom: 6,
            }}
          >
            Agent Collects Fees
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
            Trading fees flow to the agent. Claim anytime via the API.
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <Link href="/skills" className="btn-primary" style={{ fontSize: 14 }}>
          Agent Skills
        </Link>
        <Link href="/docs" className="btn-secondary">
          Agent Toolkit
        </Link>
        <Link href="/claims" className="btn-secondary">
          Claim Fees
        </Link>
      </div>

      {/* Partner Config Display */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: 8,
          padding: "12px 20px",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          fontSize: 12,
        }}
      >
        <span style={{ color: "var(--text-muted)" }}>Partner Config:</span>
        <code style={{ color: "var(--accent)", fontWeight: 600 }}>
          {partnerKey.slice(0, 8)}...{partnerKey.slice(-8)}
        </code>
        <button
          onClick={handleCopy}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            padding: 0,
          }}
          title="Copy address"
        >
          {copied ? "✅" : "📋"}
        </button>
        <span style={{ color: "var(--text-muted)" }}>|</span>
        <a
          href={`https://solscan.io/account/${partnerKey}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11 }}
        >
          Solscan
        </a>
      </div>

      {/* Free to launch note */}
      <div
        style={{
          marginTop: 16,
          fontSize: 11,
          color: "var(--text-muted)",
        }}
      >
        Free to launch. Launch protocol uses Bags FM Skill. See{" "}
        <Link href="/skills" style={{ color: "var(--accent)" }}>
          /skills
        </Link>{" "}
        for details.
      </div>
    </div>
  );
}
