import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hyper-index-dex.4everland.store',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
