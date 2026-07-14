/** @type {import('next').NextConfig} */
const isGHPages = process.env.GITHUB_ACTIONS === 'true';
const basePath = isGHPages ? '/arsendsgn' : '';

const nextConfig = {
  ...(isGHPages && { output: 'export' }),
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: isGHPages ? 'true' : 'false',
  },
  // headers() has no effect (and isn't allowed) under `output: 'export'`
  ...(!isGHPages && {
    async headers() {
      return [
        {
          source: '/models/:path*',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
      ];
    },
  }),
};
export default nextConfig;
