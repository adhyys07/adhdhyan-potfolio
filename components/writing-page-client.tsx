"use client";

import { useState } from "react";
import DevLoginModal from "./dev-login-modal";

type Props = {
  isLoggedIn: boolean;
};

export default function WritingPageClient({ isLoggedIn }: Props) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);

  async function handleLogout() {
    await fetch("/api/dev-login", { method: "DELETE" });
    setLoggedIn(false);
    window.location.reload();
  }

  return (
    <>
      {!loggedIn ? (
        <button
          type="button"
          onClick={() => setLoginOpen(true)}
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/25 hover:text-white"
        >
          Dev login
        </button>
      ) : (
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition-colors hover:border-white/25 hover:text-white"
        >
          Logout
        </button>
      )}

      <DevLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onAuthenticated={() => {
          setLoginOpen(false);
          setLoggedIn(true);
          window.location.reload();
        }}
      />
    </>
  );
}
