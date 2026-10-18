import type { NextConfig } from "next";

if (process.env.NODE_ENV === "production") {
  const requiredUrls = {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  };

  for (const [name, value] of Object.entries(requiredUrls)) {
    if (!value) {
      throw new Error(`${name} must be configured for production builds.`);
    }

    let url: URL;
    try {
      url = new URL(value);
    } catch {
      throw new Error(`${name} must be a valid absolute URL.`);
    }

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    ) {
      throw new Error(`${name} must be an HTTPS URL without credentials, query, or hash.`);
    }

    if (name === "NEXT_PUBLIC_SITE_URL" && url.pathname !== "/") {
      throw new Error("NEXT_PUBLIC_SITE_URL must be an origin without a path.");
    }
  }
}

const nextConfig: NextConfig = {
};

export default nextConfig;
