import './config/env.js';

import app from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`Makayla Platform API running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down server...`);

  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));