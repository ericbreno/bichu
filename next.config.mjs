/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: produces a fully static `out/` directory for static hosting.
  output: "export",
  // Static hosts can't run the Next.js image optimizer.
  images: { unoptimized: true },
  // Directory-style URLs play nicer on static hosts.
  trailingSlash: true,
};

export default nextConfig;
