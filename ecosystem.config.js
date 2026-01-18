// ecosystem.config.js - PM2 Configuration for production
module.exports = {
  apps: [
    {
      name: 'sales-import-app',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time_format: 'YYYY-MM-DD HH:mm:ss Z',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      ignore_watch: ['node_modules', 'logs', '.next'],
      merge_logs: true,
    },
  ],

  deploy: {
    production: {
      user: 'root',
      host: 'your-server-ip',
      key: '/path/to/private/key',
      ref: 'origin/main',
      repo: 'https://github.com/username/repository.git',
      path: '/var/www/sales-import-app',
      'post-deploy':
        'npm install && npm run build && pm2 restart ecosystem.config.js --env production',
    },
  },
}
