import type { NextConfig } from "next";

type ImagePattern = {
  protocol: "http" | "https";
  hostname: string;
  pathname: "/**";
};

// Jetpack Photon rewrites media to iN.wp.com even when WORDPRESS_URL is
// the site origin (e.g. noah.support).
const PHOTON_HOSTS = ["i0.wp.com", "i1.wp.com", "i2.wp.com"] as const;

function wordpressImagePatterns(): ImagePattern[] {
  const patterns: ImagePattern[] = PHOTON_HOSTS.map((hostname) => ({
    protocol: "https",
    hostname,
    pathname: "/**",
  }));

  const raw = process.env.WORDPRESS_URL?.trim();
  if (!raw) return patterns;

  try {
    const url = new URL(raw);
    patterns.push({
      protocol: url.protocol === "http:" ? "http" : "https",
      hostname: url.hostname,
      pathname: "/**",
    });
  } catch {
    return patterns;
  }

  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: wordpressImagePatterns(),
  },
};

export default nextConfig;
