"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";

export function WalletButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [address, setAddress] = useState<string | null>(null);
  
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  // If no Privy app ID, show a message
  if (!privyAppId) {
    return (
      <button className="bg-soul-card border border-soul-border text-soul-text px-4 py-2 rounded-lg text-sm" disabled>
        Privy not configured
      </button>
    );
  }

  useEffect(() => {
    if (user?.wallet) {
      setAddress(user.wallet.address);
    } else {
      setAddress(null);
    }
  }, [user]);

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  if (!ready) {
    return (
      <button className="bg-soul-card border border-soul-border text-soul-text px-4 py-2 rounded-lg text-sm" disabled>
        Loading...
      </button>
    );
  }

  if (authenticated && shortAddress) {
    return (
      <button
        onClick={logout}
        className="bg-soul-purple/20 border border-soul-purple/40 text-soul-accent px-4 py-2 rounded-lg text-sm hover:bg-soul-purple/30 transition-all"
      >
        {shortAddress}
      </button>
    );
  }

  return (
    <button
      onClick={login}
      className="bg-gradient-to-r from-soul-purple to-soul-blue text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity text-sm"
    >
      Connect Wallet
    </button>
  );
}
