"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function DevLoginModal({ isOpen, onClose }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }

      setUsername("");
      setPassword("");
      onClose();
      router.refresh();
    } catch {
      setError("Could not connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#1a1a1a] p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-white">Dev login</h2>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block">
            <div className="mb-2 text-sm font-medium text-white/80">Username</div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none"
              placeholder="username"
            />
          </label>
          <label className="block">
            <div className="mb-2 text-sm font-medium text-white/80">Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 transition focus:border-white/20 focus:outline-none"
              placeholder="password"
            />
          </label>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black transition disabled:opacity-60 hover:bg-white/90"
            >
              {isSubmitting ? "..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
