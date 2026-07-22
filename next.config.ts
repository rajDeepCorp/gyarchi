// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'rzm5yq3cejorz1tp.public.blob.vercel-storage.com',
        port: '',
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;