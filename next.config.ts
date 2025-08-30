import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { allowedOrigins: ["localhost", "127.0.0.1"] },
  },
};
export default nextConfig;
