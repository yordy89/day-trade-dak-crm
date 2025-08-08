/** @type {import('next').NextConfig} */
const config = {
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'assets.parqet.com', // ✅ Add the external image source
        },
        {
          protocol: 'https',
          hostname: 'financialmodelingprep.com', // (Optional) Add other sources if needed
        },
        {
            protocol: 'https',
            hostname: 'logo.clearbit.com', // (Optional) Add other sources if
        }
      ],
    },
  };
  
  export default config;
  