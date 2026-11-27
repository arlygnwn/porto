import os from "os";
import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' https://cdn.jsdelivr.net;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
`;

function getLocalNetworkIps(): string[] {
  try {
    const interfaces = os.networkInterfaces();
    const ips = new Set<string>(["127.0.0.1"]);

    for (const entries of Object.values(interfaces)) {
      if (!entries) continue;
      for (const entry of entries) {
        if (entry.family === "IPv4" && entry.address) {
          ips.add(entry.address);
        }
      }
    }

    return Array.from(ips);
  } catch {
    return ["127.0.0.1"];
  }
}

const extraDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : [];

const nextConfig: NextConfig = {
  /* config options here */
  // Next.js matches only the hostname (ports are ignored), and dynamically
  // reading os.networkInterfaces() covers localhost/LAN/VPN IPs automatically.
  allowedDevOrigins: Array.from(new Set([
    "porto.service.local",
    "localhost",
    "rly.tail1787c8.ts.net",
    ...getLocalNetworkIps(),
    ...extraDevOrigins,
  ])),
  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          }
        ],
      },
    ];
  },
};

export default nextConfig;

if (process.platform !== 'win32') {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
