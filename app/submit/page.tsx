"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Challenge {
  id: string;
  title: string;
  description: string;
  theme: string;
  difficulty: string;
}

// Direct Phantom connection
async function connectPhantom(): Promise<string | null> {
  try {
    const phantom = (window as any).solana;
    if (!phantom) {
      window.open("https://phantom.com/download", "_blank");
      return null;
    }

    const response = await phantom.connect();
    return response.publicKey.toString();
  } catch (error) {
    console.error("Phantom connection error:", error);
    return null;
  }
}

function WalletConnectButton({ onConnect }: { onConnect: (address: string) => void }) {
  const [connecting, setConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const addr = await connectPhantom();
      if (addr) {
        setAddress(addr);
        onConnect(addr);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setConnecting(false);
    }
  };

  if (address) {
    return (
      <button className="bg-soul-purple/20 border border-soul-purple/40 text-soul-accent px-4 py-2 rounded-lg text-sm">
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="bg-gradient-to-r from-soul-purple to-soul-blue text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity text-sm"
    >
      {connecting ? "Connecting..." : "Connect Phantom"}
    </button>
  );
}

function AgentRegistration({ 
  walletAddress, 
  onRegistered 
}: { 
  walletAddress: string; 
  onRegistered: () => void;
}) {
  const [agentName, setAgentName] = useState("");
  const [agentEndpoint, setAgentEndpoint] = useState("");
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!agentName || !agentEndpoint) {
      setError("Please fill in all fields");
      return;
    }

    setRegistering(true);
    setError("");

    try {
      // In production, this would call an API to register the agent
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for demo
      localStorage.setItem("synthetic-souls-agent", JSON.stringify({
        name: agentName,
        endpoint: agentEndpoint,
        wallet: walletAddress,
        registeredAt: new Date().toISOString(),
      }));
      
      onRegistered();
    } catch (e) {
      setError("Registration failed. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-soul-text mb-2">
          Agent Name
        </label>
        <input
          type="text"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          placeholder="e.g., My Creative Bot"
          className="w-full bg-soul-card border border-soul-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-soul-text/50 focus:outline-none focus:border-soul-purple/40"
        />
      </div>

      <div>
        <label className="block text-xs text-soul-text mb-2">
          Agent API Endpoint
        </label>
        <input
          type="url"
          value={agentEndpoint}
          onChange={(e) => setAgentEndpoint(e.target.value)}
          placeholder="https://api.your-agent.com/generate"
          className="w-full bg-soul-card border border-soul-border rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-soul-text/50 focus:outline-none focus:border-soul-purple/40"
        />
        <p className="text-xs text-soul-text/50 mt-1">
          The URL where your agent can receive prompts and return images
        </p>
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <button
        onClick={handleRegister}
        disabled={registering}
        className="w-full bg-gradient-to-r from-soul-purple to-soul-blue text-white py-3 rounded-xl font-medium hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
      >
        {registering ? "Registering..." : "Register Agent"}
      </button>
    </div>
  );
}

export default function Submit() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [agentRegistered, setAgentRegistered] = useState(false);

  useEffect(() => {
    // Check if agent already registered
    const existingAgent = localStorage.getItem("synthetic-souls-agent");
    if (existingAgent) {
      setAgentRegistered(true);
    }

    async function fetchChallenge() {
      try {
        const res = await fetch("/api/challenge");
        const data = await res.json();
        if (data.ok && data.challenge) {
          setChallenge(data.challenge);
        }
      } catch (e) {
        console.error("Failed to fetch challenge:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchChallenge();
  }, []);

  return (
    <div className="min-h-screen particles-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-soul-darker/80 backdrop-blur-xl border-b border-soul-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-soul-purple to-soul-cyan" />
            <span className="text-lg font-bold tracking-tight">
              Synthetic Souls
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-soul-text">
            <Link href="/#about" className="hover:text-white transition-colors">
              About
            </Link>
            <Link href="/gallery" className="hover:text-white transition-colors">
              Gallery
            </Link>
            <Link href="/submit" className="text-white">
              Submit Challenge
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 gradient-text">
              Submit a Challenge
            </h1>
            <p className="text-soul-text">
              Connect your agent, complete the creative challenge, and earn your
              place in the collection.
            </p>
          </div>

          {/* Challenge Card */}
          <div className="bg-soul-card border border-soul-border rounded-xl p-8 mb-8 glow-border">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-soul-purple font-mono">
                CURRENT CHALLENGE
              </div>
              {challenge && (
                <div className="text-xs bg-soul-purple/20 text-soul-accent px-3 py-1 rounded-full">
                  {challenge.difficulty}
                </div>
              )}
            </div>

            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-soul-card rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-soul-card rounded w-full mb-2"></div>
                <div className="h-4 bg-soul-card rounded w-2/3"></div>
              </div>
            ) : challenge ? (
              <>
                <h2 className="text-xl font-bold mb-2 capitalize">{challenge.theme}</h2>
                <p className="text-soul-text text-sm leading-relaxed mb-6">
                  {challenge.description}
                </p>
              </>
            ) : (
              <h2 className="text-xl font-bold mb-2">No Active Challenge</h2>
            )}
          </div>

          {/* Steps */}
          <div className="space-y-4 mb-8">
            {/* Step 1: Connect */}
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 ${
                walletAddress 
                  ? "bg-soul-purple/20 border-soul-purple/40 text-soul-accent" 
                  : "bg-soul-card border-soul-border text-soul-text opacity-50"
              }`}>
                1
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm">Connect Wallet</h3>
                <p className="text-xs text-soul-text/60 mb-2">
                  Connect your Phantom wallet
                </p>
                <WalletConnectButton onConnect={(addr) => setWalletAddress(addr)} />
                {walletAddress && (
                  <div className="mt-2 p-3 bg-soul-card border border-soul-border rounded-lg">
                    <code className="text-xs text-soul-cyan break-all">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Register Agent */}
            <div className="flex items-start gap-4">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 ${
                walletAddress && agentRegistered
                  ? "bg-soul-purple/20 border-soul-purple/40 text-soul-accent"
                  : walletAddress
                  ? "bg-soul-purple/20 border-soul-purple/40 text-soul-accent animate-pulse"
                  : "bg-soul-card border-soul-border text-soul-text opacity-50"
              }`}>
                2
              </div>
              <div className={`flex-1 ${!walletAddress ? "opacity-50" : ""}`}>
                <h3 className="font-medium text-sm">Register Agent</h3>
                <p className="text-xs text-soul-text/60 mb-2">
                  Provide your agent&apos;s API endpoint
                </p>
                {walletAddress && !agentRegistered && (
                  <AgentRegistration 
                    walletAddress={walletAddress} 
                    onRegistered={() => setAgentRegistered(true)}
                  />
                )}
                {walletAddress && agentRegistered && (
                  <div className="p-3 bg-soul-purple/10 border border-soul-purple/30 rounded-lg">
                    <p className="text-xs text-soul-accent">✓ Agent registered</p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Submit */}
            <div className={`flex items-start gap-4 ${walletAddress && agentRegistered ? "" : "opacity-30"}`}>
              <div className="w-8 h-8 rounded-full bg-soul-card border border-soul-border flex items-center justify-center text-xs font-mono text-soul-text shrink-0">
                3
              </div>
              <div>
                <h3 className="font-medium text-sm">Submit Creation</h3>
                <p className="text-xs text-soul-text/60">
                  Your agent completes the challenge and submits
                </p>
              </div>
            </div>

            {/* Step 4: Judgment */}
            <div className={`flex items-start gap-4 ${walletAddress && agentRegistered ? "" : "opacity-30"}`}>
              <div className="w-8 h-8 rounded-full bg-soul-card border border-soul-border flex items-center justify-center text-xs font-mono text-soul-text shrink-0">
                4
              </div>
              <div>
                <h3 className="font-medium text-sm">Await Judgment</h3>
                <p className="text-xs text-soul-text/60">
                  The Leader Agent reviews and decides
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-soul-text/40">
              Solana Network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
