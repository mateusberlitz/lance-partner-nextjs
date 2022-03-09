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
    PARTNER_PUBLIC_API: 'http://lance-partner-backend.herokuapp.com/public/api/',
    PARTNER_PUBLIC_STORAGE: 'http://lance-partner-backend.herokuapp.com/public/storage/',
    PARTNER_PUBLIC_LOCAL_API: 'http://localhost/Novidades/lance-partner-backend/public/storage/',
    PARTNER_PUBLIC_LOCAL_STORAGE: 'http://localhost/Novidades/lance-partner-backend/public/storage/',
  },
}

module.exports = nextConfig