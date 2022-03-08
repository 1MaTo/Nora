module.exports = {
  apps: [
    {
      name: "nora",
      script: "./build/bot.js",
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
    },
  ],
};
