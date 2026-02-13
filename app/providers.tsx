"use client";

import { PrivyProvider } from "@privy-io/react-auth";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "";

export function Providers({ children }: { children: React.ReactNode }) {
  // Don't wrap in PrivyProvider if no app ID is configured
  if (!privyAppId) {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#8b5cf6",
        },
        embeddedWallets: {
          solana: {
            createOnLogin: "all-users",
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
