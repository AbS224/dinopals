/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental.appDir as it's now stable
  reactStrictMode: true,
  swcMinify: true,
  
  // Environment variables that should be available to the client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Enable static export for Netlify
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Webpack configuration for better performance
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;