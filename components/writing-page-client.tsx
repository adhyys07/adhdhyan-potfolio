"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DevLoginModal from "./dev-login-modal";

type Props = {
  isLoggedIn: boolean;
};

export default function WritingPageClient({ isLoggedIn }: Props) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const router = useRouter();

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
          onClick={() => {
            setLoggedIn(false);
            document.cookie = "blog_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            router.refresh();
          }}
          className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 transition-colors hover:border-white/25 hover:text-white"
        >
          Logout
        </button>
      )}

      <DevLoginModal
        isOpen={loginOpen}
        onClose={() => {
          setLoginOpen(false);
          setLoggedIn(true);
          router.refresh();
        }}
      />
    </>
  );
}
