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
        background: "var(--bg)",
        color: "var(--text)",
        fontFamily: "var(--font-jetbrains-mono), monospace",
      }}
    >
      <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10">
        <Link href="/" style={{ color: "var(--accent-text)", textDecoration: "none", fontSize: "0.95rem" }}>
          Back to portfolio
        </Link>

        <header className="pt-14">
          <p
            style={{
              color: "var(--muted)",
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
              color: "var(--text)",
              fontFamily: "var(--font-instrument-serif), serif",
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              lineHeight: "1.05",
              margin: "0 0 20px",
            }}
          >
            PGP key
          </h1>
          <p style={{ color: "var(--muted)", lineHeight: "1.8", maxWidth: "680px" }}>
            Use this public key to verify signed messages or send encrypted email.
          </p>
          <p style={{ marginTop: "18px" }}>
            <a href="/pgp.asc" style={{ color: "var(--accent-text)", textDecoration: "none" }}>
              Open raw key
            </a>
          </p>
        </header>

        <pre
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--accent-text)",
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
