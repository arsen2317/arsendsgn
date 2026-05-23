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
  },
};
export default nextConfig;
