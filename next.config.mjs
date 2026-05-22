/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '/arsendsgn',
  assetPrefix: '/arsendsgn',
};
export default nextConfig;
