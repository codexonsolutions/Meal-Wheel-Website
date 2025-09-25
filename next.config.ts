import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
<<<<<<< HEAD
=======
        port: '',
        pathname: '**',
>>>>>>> staging
      },
      {
        protocol: 'http',
        hostname: '**',
<<<<<<< HEAD
      }
    ],
    unoptimized: false, // Keep optimization enabled
=======
        port: '',
        pathname: '**',
      },
    ],
>>>>>>> staging
  },
};

export default nextConfig;
