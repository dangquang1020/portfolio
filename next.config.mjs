import mdx from '@next/mdx';

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {},
});

// Determine if we're deploying to GitHub Pages
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';
// Repository name for GitHub Pages base path (e.g., 'magic-portfolio')
// This will be automatically set by the GitHub Actions workflow
const repoName = process.env.REPO_NAME || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  transpilePackages: ['next-mdx-remote'],
  // Configure basePath for GitHub Pages deployment
  // If deploying to https://<username>.github.io/<repo-name>/, set basePath to '/<repo-name>'
  basePath: isGitHubPages && repoName ? `/${repoName}` : '',
  assetPrefix: isGitHubPages && repoName ? `/${repoName}/` : '',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
  sassOptions: {
    compiler: 'modern',
    silenceDeprecations: ['legacy-js-api'],
  },
  output: 'export',
  trailingSlash: true,
};

export default withMDX(nextConfig);
