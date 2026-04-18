const nextConfig = {
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Webpack config — used when running with --webpack flag
  webpack(conf) {
    const fileLoaderRule = conf.module.rules.find((rule) => rule.test?.test?.('.svg'));

    conf.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return conf;
  },
};

export default nextConfig;
