module.exports = {
  apps: [
    {
      name: 'nest-server',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      instances: 0,
      max_memory_restart: '1024M',
    },
  ],
};
