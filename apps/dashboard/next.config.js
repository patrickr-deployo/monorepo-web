/** @type {import('next').NextConfig} */
const nextConfig = {
    /** Enables hot reloading for local packages without a build step */
    transpilePackages: [
      "@package/tailwind-config",
      "@package/eslint-config",
      "@package/typescript-config",
      "@package/prettier-config",
    ],
    images: {
      remotePatterns: [
        {
          hostname: "lh3.googleusercontent.com",
        },
        {
          hostname: "avatars.githubusercontent.com",
        },
      ],
    },
  }
  
  module.exports = nextConfig