/** @type {import('next').NextConfig} */

// await import("./env.js");
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "**",
          },
        ],
      },
      async redirects() {
        return [
          {
            source: "/product",
            destination: "/products",
            permanent: true,
          },
        ];
      },

};

export default nextConfig;
