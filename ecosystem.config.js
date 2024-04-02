module.exports = {
  apps: [
    {
      name: "my-nest-app",
      script: "dist/main.js",
      exec_mode: "cluster",
      instances: 1,
      watch: ["src"],
      ignore_watch: ["node_modules"],
      env: {
        NODE_ENV: "development",
      },
    },
  ],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
