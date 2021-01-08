module.exports = {
  apps: [
    {
      name: 'superbikowbie',
      script: 'npx',
      args: 'serve -s build -l 4000 -n',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
