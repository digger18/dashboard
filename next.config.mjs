import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: true,
    turbo: true,
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "https://e2b.dev",
      },
    ];
  },
};

export default withMDX(config);
