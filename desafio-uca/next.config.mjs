/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.jsdelivr.net',
                port: '',
                pathname: '/npm/heroicons@2.0.18/**',
            },
            {
                protocol: 'https',
                hostname: 'example.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
