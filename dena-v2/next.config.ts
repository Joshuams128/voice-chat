import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.app.github.dev',
        'bug-free-barnacle-x5wgq994v6vjfjv6-3000.app.github.dev'
      ]
    }
  }
};

export default nextConfig;
