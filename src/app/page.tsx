import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import TokenList from "@/components/TokenList";

export default function Home() {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
      <HeroSection />
      <StatsBar />

      <div style={{ marginBottom: 16 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          Token Directory
        </h2>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
          Bags FM tokens on Solana &mdash; stats above reflect only tokens launched via our partner config
        </p>
      </div>

      <TokenList />
    </div>
  );
}
