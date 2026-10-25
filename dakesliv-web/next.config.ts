import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Gallery photos are uploaded by admins and served from wherever the
    // backend stores them (local disk, S3, Cloudinary, etc.) — the exact
    // host isn't settled yet, so this stays permissive until it is. Narrow
    // this to the real upload host once that's decided.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
