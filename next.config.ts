import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // The design-review routes are only recognized by the staging build.
  pageExtensions: process.env.ARKEZ_INDEXABLE === "1"
    ? ["tsx", "ts", "jsx", "js"]
    : process.env.ARKEZ_LOCAL_PREVIEW === "1"
      ? ["local.tsx", "stage.tsx", "tsx", "ts", "jsx", "js"]
      : ["stage.tsx", "tsx", "ts", "jsx", "js"],
  trailingSlash: true,
  poweredByHeader: false,
  devIndicators: false,
  generateBuildId: async () => process.env.ARKEZ_BUILD_ID ?? null,
};

export default nextConfig;
