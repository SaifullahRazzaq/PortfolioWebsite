import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /*
   * Static export: `next build` writes plain HTML/CSS/JS to `out/`, which
   * Netlify serves directly. Every route is static (no request-time data), so
   * nothing is lost, and the deploy no longer depends on Netlify's Next.js
   * runtime — which did not run and left the raw `.next` folder published.
   */
  output: 'export',

  /*
   * Pin the workspace root.
   *
   * There is a stray package-lock.json in a parent directory on the author's
   * machine, and Turbopack otherwise walks up the tree and adopts it as the
   * root. `import.meta.dirname` is this file's own directory, which is the
   * project root by definition — unlike `process.cwd()`, which depends on where
   * the build was invoked from and is not guaranteed on a CI runner.
   */
  turbopack: { root: import.meta.dirname },

  /*
   * `transpilePackages: ['three']` used to be here.
   *
   * It is not needed — three ships ESM that Turbopack handles natively — and it
   * was expensive: three is 25MB on disk and forcing it through transpilation is
   * the single largest avoidable cost in the build.
   */
};

export default nextConfig;
