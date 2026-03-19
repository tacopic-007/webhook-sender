import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/webhook-sender",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
