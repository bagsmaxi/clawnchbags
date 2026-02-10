"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { shortenAddress } from "@/lib/format";

interface Pool {
  tokenMint: string;
  dbcConfigKey: string;
  dbcPoolKey: string;
  dammV2PoolKey: string | null;
}

type SortMode = "new" | "migrated";

export default function TokenList() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>("new");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    const migrated = sortMode === "migrated";
    fetch(`/api/pools?onlyMigrated=${migrated}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPools(d.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sortMode]);

  const filtered = pools.filter((p) =>
    p.tokenMint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <button
          className={`filter-pill ${sortMode === "new" ? "active" : ""}`}
          onClick={() => setSortMode("new")}
        >
          🔥 All Tokens
        </button>
        <button
          className={`filter-pill ${sortMode === "migrated" ? "active" : ""}`}
          onClick={() => setSortMode("migrated")}
        >
          💎 Migrated (DAMM v2)
        </button>
        <div style={{ flex: 1 }} />
        <input
          className="input-field"
          placeholder="Search by mint address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 280, padding: "8px 12px", fontSize: 12 }}
        />
      </div>

      {/* Count */}
      <div
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
          marginBottom: 12,
        }}
      >
        {loading ? "Loading..." : `${filtered.length} tokens`}
      </div>

      {/* Table Header */}
      <div
        className="token-row"
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "var(--text-muted)",
          fontWeight: 700,
          borderBottom: "2px solid var(--border-color)",
          background: "var(--bg-secondary)",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <div>#</div>
        <div>Token Mint</div>
        <div>DBC Pool</div>
        <div>Config</div>
        <div>DAMM v2</div>
        <div>Action</div>
      </div>

      {/* Token rows */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          maxHeight: 600,
          overflowY: "auto",
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="token-row">
                <div
                  className="loading-skeleton"
                  style={{ width: 20, height: 16 }}
                />
                <div
                  className="loading-skeleton"
                  style={{ width: "80%", height: 16 }}
                />
                <div
                  className="loading-skeleton"
                  style={{ width: "60%", height: 16 }}
                />
                <div
                  className="loading-skeleton"
                  style={{ width: "60%", height: 16 }}
                />
                <div
                  className="loading-skeleton"
                  style={{ width: "40%", height: 16 }}
                />
                <div
                  className="loading-skeleton"
                  style={{ width: 50, height: 24 }}
                />
              </div>
            ))
          : filtered.map((pool, i) => (
              <Link
                key={pool.tokenMint}
                href={`/token/${pool.tokenMint}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="token-row animate-fade-in">
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    {i + 1}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--accent)",
                      }}
                    >
                      {shortenAddress(pool.tokenMint, 6)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {shortenAddress(pool.dbcPoolKey)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {shortenAddress(pool.dbcConfigKey)}
                  </div>
                  <div>
                    {pool.dammV2PoolKey ? (
                      <span
                        style={{
                          fontSize: 10,
                          background: "rgba(34, 197, 94, 0.15)",
                          color: "var(--green)",
                          padding: "2px 8px",
                          borderRadius: 10,
                          fontWeight: 600,
                        }}
                      >
                        Migrated
                      </span>
                    ) : (
                      <span
                        style={{
                          fontSize: 10,
                          color: "var(--text-muted)",
                        }}
                      >
                        DBC
                      </span>
                    )}
                  </div>
                  <div>
                    <span
                      className="btn-secondary"
                      style={{ padding: "4px 10px", fontSize: 11 }}
                    >
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}

        {!loading && filtered.length === 0 && (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 13,
            }}
          >
            No tokens found{searchTerm ? ` matching "${searchTerm}"` : ""}
          </div>
        )}
      </div>
    </div>
  );
}
