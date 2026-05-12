import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

export const metadata = {
  title: "PGP Key",
  description: "Public PGP key for Adhdhyan.",
};

function getPgpKey() {
  const pgpPath = path.join(process.cwd(), "public", "pgp.asc");

  if (!fs.existsSync(pgpPath)) {
    return "PGP public key is not configured yet.";
  }

  return fs.readFileSync(pgpPath, "utf-8");
}

export default function PgpPage() {
  const key = getPgpKey();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0c0c0f",
        color: "#e8e6e0",
        fontFamily: "var(--font-jetbrains-mono), monospace",
      }}
    >
      <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10">
        <Link href="/" style={{ color: "#d4f060", textDecoration: "none", fontSize: "0.95rem" }}>
          Back to portfolio
        </Link>

        <header className="pt-14">
          <p
            style={{
              color: "#7a7870",
              fontSize: "10px",
              letterSpacing: "0.25em",
              marginBottom: "10px",
              textTransform: "uppercase",
            }}
          >
            public identity
          </p>
          <h1
            style={{
              color: "#e8e6e0",
              fontFamily: "var(--font-instrument-serif), serif",
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              lineHeight: "1.05",
              margin: "0 0 20px",
            }}
          >
            PGP key
          </h1>
          <p style={{ color: "#aaa69c", lineHeight: "1.8", maxWidth: "680px" }}>
            Use this public key to verify signed messages or send encrypted email.
          </p>
          <p style={{ marginTop: "18px" }}>
            <a href="/pgp.asc" style={{ color: "#d4f060", textDecoration: "none" }}>
              Open raw key
            </a>
          </p>
        </header>

        <pre
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            color: "#d4f060",
            fontSize: "12px",
            lineHeight: "1.7",
            marginTop: "34px",
            overflowX: "auto",
            padding: "18px",
            whiteSpace: "pre-wrap",
          }}
        >
          {key}
        </pre>
      </div>
    </main>
  );
}
