/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  env: {
    PARTNER_PUBLIC_API: 'http://localhost/Novidades/lance-partner-backend/public/api/',
    PARTNER_PUBLIC_STORAGE: 'http://localhost/Novidades/lance-partner-backend/public/storage/',
  },
}

module.exports = nextConfig