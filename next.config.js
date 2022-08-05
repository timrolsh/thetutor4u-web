//nextjs complains if this file is a typescript file and not a javascript file
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    build: {
        extend(config, {}) {
            config.node = {
                fs: "empty"
            };
        }
    }
};

module.exports = nextConfig;
