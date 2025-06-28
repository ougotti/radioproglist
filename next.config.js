/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/radioproglist',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig