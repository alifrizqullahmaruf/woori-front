import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   globalNotFound: true,
  // },
  // next.config.js
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d95fddh07astf.cloudfront.net",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    // TODO: Set NEXT_PUBLIC_BACKEND_URL in .env file
    // Remove the fallback default ("http://20.196.144.224")
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://20.196.144.224";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`, // bypass cors
      },
    ];
  },
  webpack(config) {
    // webpack 설정 (개발 환경에서 사용)
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
