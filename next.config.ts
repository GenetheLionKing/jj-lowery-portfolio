import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  env: {
    // Public build flag, derived only from Vercel's deployment target.
    NEXT_PUBLIC_ANALYTICS_PRODUCTION:
      process.env.VERCEL_ENV === "production" ? "true" : "false",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Referrer-Policy", value: "strict-origin" }],
      },
    ];
  },
};

export default nextConfig;
