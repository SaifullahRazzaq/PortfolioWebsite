import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root — there is a stray lockfile in a parent directory
  // and Turbopack otherwise walks up and picks the wrong one.
  turbopack: { root: path.resolve(process.cwd()) },
  // three ships untranspiled ESM in a few subpaths that drei pulls in.
  transpilePackages: ['three'],
};

// Shaders live in /shaders as typed TS template literals rather than .glsl files,
// so no raw-loader / turbopack rule is needed.

export default nextConfig;
