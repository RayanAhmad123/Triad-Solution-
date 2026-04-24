/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
  async redirects() {
    return [{ source: '/', destination: '/admin', permanent: false }];
  },
};
module.exports = nextConfig;
