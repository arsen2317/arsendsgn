/** @type {import('next').NextConfig} */
const basePath = process.env.GITHUB_ACTIONS === 'true' ? '/arsendsgn' : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
export default nextConfig;
