import type { NextConfig } from "next";

const pollMs = process.env.NEXT_DISABLE_WATCH_POLL
  ? undefined
  : Number(process.env.NEXT_WATCH_POLL_MS) || 500;

const nextConfig: NextConfig = {
  ...(pollMs != null ? { watchOptions: { pollIntervalMs: pollMs } } : {}),
};

export default nextConfig;
