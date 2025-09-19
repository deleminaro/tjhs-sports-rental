/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/rentals' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/rentals/' : '',
}

module.exports = nextConfig
