// ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'myapp',
      script: './app.js',
      env: {
        NODE_ENV: 'production',
        PORT: 8800, // Ensure this matches your IIS reverse proxy
      },
    },
  ],
};
