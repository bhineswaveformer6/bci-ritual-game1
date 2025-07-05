const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE || (process.env.NETLIFY ? 'export' : 'standalone'),
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost'],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // Enable standalone output for Docker and other platforms
  ...(process.env.DOCKER || process.env.RAILWAY || process.env.RENDER ? {
    output: 'standalone'
  } : {}),
  // Disable static export for platforms that need server-side features
  ...(process.env.NETLIFY ? {
    trailingSlash: true,
    images: {
      unoptimized: true
    }
  } : {}),
};

module.exports = nextConfig;
