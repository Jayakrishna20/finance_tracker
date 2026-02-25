import { buildApp } from './app';

const PORT = 3000;

const start = async () => {
  const app = await buildApp();

  try {
    // 0.0.0.0 mapping enables connection via docker or public routing environments
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`✅ Server aggressively running on http://localhost:${PORT} `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
