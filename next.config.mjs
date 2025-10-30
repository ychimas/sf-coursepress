/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      memoryLimit: 4096,
    },
  },
  webpack: (config, { isServer }) => {
    config.cache = false
    config.optimization = {
      ...config.optimization,
      minimize: false,
      splitChunks: {
        chunks: 'all',
        maxSize: 244000,
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
    }
    return config
  },
}

export default nextConfig
