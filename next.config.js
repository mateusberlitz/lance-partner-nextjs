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
    PARTNER_PUBLIC_API: 'https://lance-partner-backend.herokuapp.com/public/api/',
    PARTNER_PUBLIC_STORAGE: 'https://lance-partner.s3.sa-east-1.amazonaws.com/',
    PARTNER_PUBLIC_LOCAL_API: 'http://localhost/Novidades/lance-partner-backend/public/api/',
    PARTNER_PUBLIC_LOCAL_STORAGE: 'http://localhost/Novidades/lance-partner-backend/public/storage/',
  },
}

module.exports = nextConfig