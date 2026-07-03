import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        "**/.home/**",
        "**/.pnpm-cache/**",
        "**/.pnpm-config/**",
        "**/.pnpm-store/**",
        "**/node_modules/**",
      ],
    };

    return config;
  },
};

export default nextConfig;
