import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.licdn.com",
        pathname: "/aero-v1/**",
      },
    ],
  },
};

export default nextConfig;
