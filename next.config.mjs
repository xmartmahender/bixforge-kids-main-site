/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the experimental.appDir option as it's now the default in Next.js 14
  // and is causing a warning during build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

export default nextConfig;