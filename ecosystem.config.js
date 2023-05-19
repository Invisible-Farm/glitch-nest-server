module.exports = {
  apps: [
    {
      name: 'nest-server',
      script: 'dist/main.js',
      exec_mode: 'cluster',
      instances: 1,
      max_memory_restart: '1024M',
    },
  ],
};
